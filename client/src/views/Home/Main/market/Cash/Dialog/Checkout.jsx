import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAjax } from "../../../../../AjaxProvider";
import { Modal, Statistic, Radio, Input, Button, Switch } from "antd";
import styled from "../../../../../../styles/cash.scss";
import { mathc } from "../../../../../../tools/mathc";
import config from "../../../../../../config";
import { PosPrint } from "../../../../../../device/pos_print";
import { MoneyBox } from "../../../../../../device/money_box";
import { Order } from "../../../../../../tasks/frontOrder";
import { resetOrderAction, addOrderToHistoryAction } from "../../../../../../redux/action";
import { ClientDisplay } from "../../../../../../device/client_display";

const { confirm } = Modal;

const { GLOBAL_FRONT_BOX_STATUS, GLOBAL_FRONT_AUTO_PRINT_STATUS } = config;

function DeviceStatus({ value, status, fn, hotkey }) {

    return (
        <div>
            <Switch
                checked={status}
                onChange={fn}
            />&nbsp;
            {value}
            {`<${hotkey}>`}
        </div>
    );
}

export function Checkout({
    status,
    hideFn,
    money: sale_price,
    origin_price,
    list,
    vipCode
}) {

    const dispatch = useDispatch();

    const ajax = useAjax();

    const [printStatus, setPrintStatus] = useState(localStorage.getItem(GLOBAL_FRONT_AUTO_PRINT_STATUS) !== "hide");
    // 是否自动打印小票

    const [moneyBoxStatus, setBoxStatus] = useState(localStorage.getItem(GLOBAL_FRONT_BOX_STATUS) !== "hide");
    // 结账完成自动打开钱箱


    function handleBoxConfig(b) {
        function save(bool) {
            if (bool) {
                localStorage.removeItem(GLOBAL_FRONT_BOX_STATUS);
            } else {
                localStorage.setItem(GLOBAL_FRONT_BOX_STATUS, "hide");
            }
        }

        if (b === undefined) {
            save(!moneyBoxStatus);
            setBoxStatus(s => !s);
        } else {
            save(b);
            setBoxStatus(b);
        }
    }

    function handlePrintConfig(b) {
        function save(bool) {
            if (bool) {
                localStorage.removeItem(GLOBAL_FRONT_AUTO_PRINT_STATUS);
            } else {
                localStorage.setItem(GLOBAL_FRONT_AUTO_PRINT_STATUS, "hide");
            }
        }

        if (b === undefined) {
            save(!printStatus);
            setPrintStatus(s => !s);
        } else {
            save(b);
            setPrintStatus(b);
        }
    }


    const hotKeyList = [
        {
            value: "现金",
            hotkey: "F1"
        },
        {
            value: "支付宝",
            hotkey: "F2"
        },
        {
            value: "微信",
            hotkey: "F3"
        },
        {
            value: "小票打印",
            hotkey: "F4",
            status: printStatus,
            fn: handlePrintConfig,
            device: true
        },
        {
            value: "自动开启钱箱",
            hotkey: "F5",
            status: moneyBoxStatus,
            fn: handleBoxConfig,
            device: true
        }
    ];

    const inputRef = useRef(null);
    const [data, setData] = useState({
        show_client_pay: sale_price,
        // 结账界面左侧的实付金额，当右侧输入的金额(client_pay)是合法数值时会和这里同步
        client_pay: sale_price,


        pay_type: hotKeyList[0].value,
        // 支付方式选择

        change: 0
        // 找零金额
    });

    const { show_client_pay, client_pay, pay_type, change } = data;


    const checkPassFlag = list.length > 0 && String(show_client_pay) === String(client_pay) && change >= 0;
    // 当前状态是否可以结账的flag

    function closeModal() {
        hideFn();
        setData(s => ({
            ...s,
            pay_type: hotKeyList[0].value,
            change: 0
        }));
        ClientDisplay.reset();
    }

    const changeStyle = {
        color: "red"
    }

    const moneyStyle = {
        color: "#4c8bf5"
    }

    function handlePayTypeChange({ target }) {
        setData(s => ({
            ...s,
            pay_type: target.value
        }));
    }

    function handleClientPay({ target }) {
        // 将输入的用户付款金额同步到state里


        const { value } = target;
        if (value.length >= 9) return;


        const v = (() => {
            if (value === "" || value[value.length - 1] === ".") return value;
            const num = Number(value);
            return Number.isNaN(num) ? value : num;
        })();

        if (typeof v === "number") {
            if (v < 0 || v > 999999) return;
            const index = value.indexOf(".");
            if (index !== -1 && value.slice(index + 1).length > 2) return;
            // 小数位超过两位时return

            setData(s => ({
                ...s,
                client_pay: value,
                change: mathc.subtract(v, sale_price),
                show_client_pay: v
            }));

            ClientDisplay.show({
                pay_price: v,
                change: mathc.subtract(v, sale_price),
            });
        } else {
            if (v === "") {
                setData(s => ({
                    ...s,
                    client_pay: v,
                    change: mathc.subtract(0, sale_price),
                    show_client_pay: 0,
                }));
                ClientDisplay.show({
                    pay_price: 0,
                    change: mathc.subtract(0, sale_price)
                });
            } else {
                setData(s => ({
                    ...s,
                    client_pay: v
                }));
            }
        }

    }

    function check() {
        // 结账
        if (!checkPassFlag) return;

        async function end() {
            let allCount = 0;
            const commodity_list = list.map(
                ({
                    barcode,
                    origin_price,
                    sale_price,
                    count,
                    status
                }) => {
                    allCount = mathc.add(allCount, count);
                    return {
                        barcode,
                        origin_price,
                        sale_price,
                        count,
                        status
                    };
                }
            );

            const orderData = {
                pay_type,
                client_pay: show_client_pay,
                change,
                origin_price,
                sale_price,
                commodity_list,
                count: allCount
            };
            if (vipCode) {
                orderData["vip_code"] = vipCode;
            }

            moneyBoxStatus && MoneyBox.open();
            // 打开钱箱


            try {
                const { data } = await Order.submitOrder(ajax, orderData);
                // 提交订单


                closeModal();
                // 关闭结账界面

                dispatch(resetOrderAction());
                // 清空当前收银界面

                dispatch(addOrderToHistoryAction(data));
                // 提交订单信息到历史订单里
                printStatus && PosPrint.print(data);
            } catch (error) {
                console.log(error);
            }
        }

        if (change > 100) {
            confirm({
                okText: "继续",
                title: "找零金额大于100，继续吗?",
                onOk: end,
                autoFocusButton: "cancel"
            });
        } else end();
    }

    function handleHotKey(e) {
        // 处理快捷键


        const { key } = e;
        const item = hotKeyList.find(({ hotkey }) => hotkey === key);
        item && (!item.device ? (() => {
            if (item.value == pay_type) return;
            e.preventDefault();
            setData(s => ({
                ...s,
                pay_type: item.value
            }));
        })() : item.fn());
    }

    useEffect(() => {
        status && setTimeout(() => {
            // 当打开结账界面时将订单金额同步到结账界面里并聚焦和选中付款金额


            setData(s => ({
                ...s,
                show_client_pay: sale_price,
                client_pay: sale_price
            }));
            const { current } = inputRef;
            current.focus(); current.input.setSelectionRange(0, 10);
        });
    }, [status]);

    return (
        <Modal
            visible={status}
            title="结账"
            closable={false}
            onCancel={closeModal}
            footer={null}
            width={500}
            className={styled["cash-dialog-checkout"]}
        >
            <div className={styled["wrap"]}>
                <div>
                    <Statistic
                        title="应付金额"
                        value={origin_price}
                        precision={2}
                    />
                    <Statistic
                        title="实际金额"
                        value={sale_price}
                        valueStyle={moneyStyle}
                        precision={2}
                    />
                    <Statistic
                        title="实付金额"
                        value={show_client_pay}
                        precision={2}
                    />
                    <Statistic
                        title="找零金额"
                        value={change}
                        valueStyle={changeStyle}
                        precision={2}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexFlow: "column"
                    }}
                >
                    <div
                        className={styled["device-status-wrap"]}
                    >
                        <p>设备状态: </p>
                        <div className={styled["device-status"]}>
                            {
                                hotKeyList
                                    .filter(({ device }) => device)
                                    .map(({ value, status, fn, hotkey }) => (
                                        <DeviceStatus
                                            key={value}
                                            value={value}
                                            status={status}
                                            fn={fn}
                                            hotkey={hotkey}
                                        />
                                    ))
                            }
                        </div>
                    </div>
                    <div className={styled["pay-type-wrap"]}>
                        <p>支付方式: </p>
                        <Radio.Group
                            value={pay_type}
                            onChange={handlePayTypeChange}
                            name="pay_type"
                        >
                            {
                                hotKeyList
                                    .filter(({ device = false }) => !device)
                                    .map(
                                        ({ value, hotkey }) => (
                                            <Radio
                                                key={value}
                                                value={value}
                                            >
                                                {`${value}<${hotkey}>`}
                                            </Radio>
                                        )
                                    )
                            }
                        </Radio.Group>
                    </div>
                    <div className={styled["check-wrap"]}>
                        <p>付款金额: </p>
                        <div className={styled["input-wrap"]}>
                            <Input
                                size="large"
                                ref={inputRef}
                                value={client_pay}
                                placeholder="请输入付款金额"
                                onChange={handleClientPay}
                                onKeyDown={handleHotKey}
                                onPressEnter={check}
                            />
                            <Button
                                onClick={check}
                                type="primary"
                                size="large"
                                disabled={!checkPassFlag}
                            >结账</Button>
                        </div>
                    </div>
                    {
                        /**
                         * 这部分空白留作展示线上支付结果
                         * 又挖坑了
                         * 
                         */
                    }
                </div>
            </div>
        </Modal>
    );
}