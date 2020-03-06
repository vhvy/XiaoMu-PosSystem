import React, { useState, useEffect, useMemo, useRef } from "react";
import { Input, Modal, Button, message as antdMessage } from "antd";
import styled from "../../../../../../styles/cash.scss";
import {
    VirtualSelectList,
    VirtualSelectListHeader,
    VirtualSelectListFooter,
    createRenderItemFn
} from "../../../../../../components/VirtualSelectList";
import { useDispatch } from "react-redux";
import {
    initCashHistoryOrderAction,
    undoOrderFromHistoryAction,
    addVipToHistoryOrderAction,
    importHistoryOrderAction
} from "../../../../../../redux/action";
import { Order } from "../../../../../../tasks/frontOrder";
import { CommodityTasks } from "../../../../../../tasks/commodity";
import { useAjax } from "../../../../../AjaxProvider";
import { Printer } from "../../../../../../device/print";
import { getFormatTime } from "../../../../../../tools/time";
import { mathc } from "../../../../../../tools/mathc";
import { OrderDetails } from "./common/OrderDetails";

export function HistoryOrder({ status, hideFn, list }) {

    const dispatch = useDispatch();
    const ajax = useAjax();

    function closeModal() {
        // 关闭当前Modal

        hideFn();
    }
    const initState = {
        select: list[0] && list[0].order_id || 0,
        selectType: "origin",
        commodity_list: list[0] && list[0].commodity_list || []
    };

    const [selectData, setSelectData] = useState(initState);

    const [addVipModalStatus, setAddVipModalStatus] = useState(false);

    function hideAddVipModal() {
        setAddVipModalStatus(false);
    }

    const { select, selectType, commodity_list } = selectData;

    useEffect(() => {
        // 第一次挂载组件时从服务端获取今日已完成订单

        async function init() {
            try {
                const { data } = await Order.historyOrder(ajax);
                dispatch(initCashHistoryOrderAction(data));
            } catch (error) {
                console.log(error);
            }
        }

        init();
    }, []);

    useEffect(() => {
        !status && setSelectData(initState);
    }, [list]);

    function handleClickSelect(id) {
        setSelectData(s => ({
            ...s,
            select: id,
            selectType: "click",
            commodity_list: list.find(({ order_id }) => order_id === id).commodity_list
        }));
    }



    const selectFlag = list.length > 0 && list.find(({ order_id }) => order_id === select);
    // 当前有选中订单的flag

    const undo_flag = selectFlag && selectFlag.is_undo === 0;
    // 当前选中订单可以进行撤销的flag

    const addvip_flag = selectFlag && !selectFlag.vip_code
    // 当前选中订单可以进行追加积分的flag



    function handlePrint() {
        // 打印订单小票
        Printer.print("小票已打印");
    }


    async function handleImport() {
        // 导入当前订单商品到前台

        if (!selectFlag) return;

        try {
            const list = await Promise.all(
                selectFlag.commodity_list.map(
                    async ({ barcode }) => (await CommodityTasks.query(ajax, barcode)).data
                )
            );
            // 从后台获取当前商品信息


            const commodity_list = [];
            const fail_list = [];
            list.map(arr => {
                if (arr.length !== 1) {
                    fail_list.push(arr[0]);
                } else if (arr[0].is_delete) {
                    fail_list.push(arr[0]);
                } else {
                    const tmp = arr[0];
                    // 后台返回的新商品信息

                    const { count } = selectFlag.commodity_list.find(({ barcode }) => barcode === tmp.barcode);
                    // 之前已完成订单里的商品信息

                    commodity_list.push(Object.assign({}, tmp, {
                        count,
                        money: mathc.multiply(count, tmp.sale_price)
                    }));
                }
            });

            closeModal();
            dispatch(importHistoryOrderAction(commodity_list));
            antdMessage.warn(`有${fail_list.length}个商品未能成功导入!`);
        } catch (error) {
            console.log(error);
        }
    }

    function handleUndo() {
        // 撤销订单
        if (!undo_flag) return;

        async function undo() {

            try {
                const { data } = await Order.undoOrder(ajax, select);
                dispatch(undoOrderFromHistoryAction(data));
                antdMessage.success("已成功撤销订单!");
            } catch (error) {
                console.log(error);
            }

        }

        Modal.confirm({
            title: "确认要撤销此订单吗?",
            okText: "撤销",
            okButtonProps: {
                type: "danger"
            },
            onOk: undo
        })
    }

    function dispatchVip(data) {
        // 将追加会员之后的新订单数据替换到store里

        dispatch(addVipToHistoryOrderAction(data));
    }

    function handleAddvip() {
        // 追加会员积分

        addvip_flag && setAddVipModalStatus(true);
    }

    function handleArrowUp() {
        if (list.length < 2) return;
        const index = list.findIndex(({ order_id }) => order_id === select);
        if (index === 0) return;

        setSelectData(s => ({
            ...s,
            select: list[index - 1].order_id,
            selectType: "up",
            commodity_list: list[index - 1].commodity_list
        }));
    }

    function handleArrowDown() {
        if (list.length < 2) return;
        const index = list.findIndex(({ order_id }) => order_id === select);
        if (index === list.length - 1) return;

        setSelectData(s => ({
            ...s,
            select: list[index + 1].order_id,
            selectType: "down",
            commodity_list: list[index + 1].commodity_list
        }));
    }

    function handleHotKey(e) {
        const { key } = e;
        const item = hotkey.find(i => i.key === key);
        item && (() => {
            e.preventDefault();
            item.fn();
        })();
    }

    const hotkey = [
        {
            title: "打印",
            key: "F1",
            fn: handlePrint,
            status: selectFlag
        },
        {
            title: "导入",
            key: "F2",
            fn: handleImport,
            status: selectFlag
        },
        {
            title: "追加积分",
            key: "F3",
            fn: handleAddvip,
            status: addvip_flag
        },
        {
            title: "撤销",
            key: "F4",
            fn: handleUndo,
            type: "danger",
            status: undo_flag
        },
        {
            key: "ArrowUp",
            fn: handleArrowUp,
            show: false
        },
        {
            key: "ArrowDown",
            fn: handleArrowDown,
            show: false
        },
    ];

    const ModalFooter = useMemo(() => (<BaseModalFooter hotkey={hotkey.filter(({ show = true }) => show)} />), [hotkey]);

    const VipModal = useMemo(() => (
        <AddVipModal
            addVip={dispatchVip}
            order_id={select}
            status={addVipModalStatus}
            hideFn={hideAddVipModal}
            ajax={ajax}
        />
    ), [select, addVipModalStatus]);

    return (
        <div tabIndex="-1" onKeyDown={handleHotKey}>
            <Modal
                visible={status}
                title="订单查询"
                onCancel={closeModal}
                width={700}
                className={styled["cash-dialog-history-order"]}
                footer={ModalFooter}
            >
                {VipModal}
                <OrderList
                    select={select}
                    selectType={selectType}
                    handleClick={handleClickSelect}
                    list={list}
                />
                <OrderDetails wrapCss={styled["order-details"]} data={commodity_list} />
            </Modal>
        </div>
    );
}

function AddVipModal({ addVip, order_id, status, hideFn, ajax }) {
    const [vip_code, setVipCode] = useState("");

    const inputRef = useRef(null);

    function closeModal() {
        // 关闭Modal

        hideFn();
        setVipCode("");
    }


    async function add() {
        // 执行追加的操作

        try {
            const { data } = await Order.addVipOrder(ajax, order_id, vip_code);
            addVip(data);
            closeModal();
            antdMessage.success("追加成功!");
        } catch (error) {
            console.log(error);
        }
    }

    function handleChange({ target }) {
        setVipCode(target.value);
    }

    useEffect(() => {
        if (status) {
            setTimeout(() => {
                inputRef.current.focus();
            });
        }
    }, [status]);

    function handleEnter() {
        vip_code.length === 4 && add();
    }

    return (
        <Modal
            width={400}
            visible={status}
            title="请输入需要追加的会员卡号"
            okButtonProps={{
                disabled: vip_code.length !== 4
            }}
            onOk={add}
            onCancel={closeModal}
        >
            <Input
                ref={inputRef}
                onChange={handleChange}
                onPressEnter={handleEnter}
            />
        </Modal>
    );
}

const OrderListColumns = [
    {
        title: "序号",
        key: "index",
        type: 1,
        center: true
    },
    {
        title: "单号",
        key: "order_id",
        type: 2,
        center: true
    },
    {
        title: "数量",
        key: "count",
        type: 3,
        center: true
    },
    {
        title: "金额",
        key: "sale_price",
        type: 3,
        center: true
    },
    {
        title: "会员卡号",
        key: "vip_code",
        type: 3,
        center: true
    },
    {
        title: "销售时间",
        key: "time",
        type: 2,
        center: true
    },
    {
        title: "状态",
        key: "is_undo",
        type: 1,
        center: true
    }
];

const OrderListFooter = (length) => ([
    {
        title: "共计",
        type: 1,
        value: length || 0,
        center: true
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

function OrderList({ handleClick, select, selectType, list }) {
    // 历史订单列表

    const Header = useMemo(() => (<VirtualSelectListHeader data={OrderListColumns} />), []);

    const Footer = useMemo(() => (<VirtualSelectListFooter data={OrderListFooter(list.length)} />), [list.length]);

    function handleColumnCss(css, styled, data) {
        if (data.is_undo !== "正常") {
            return [...css, styled["undo"]];
        }
        return css;
    }

    const renderItem = useMemo(() => createRenderItemFn(OrderListColumns, handleClick, "order_id", handleColumnCss), [handleClick]);

    const data = useMemo(() =>
        list.map(({ order_id, sale_price, count = 1, vip_code, check_date, is_undo }) => ({
            order_id,
            sale_price,
            count,
            vip_code: vip_code || "-",
            time: getFormatTime(check_date),
            is_undo: is_undo === 1 ? "撤销" : "正常"
        }))
        , [list]);

    return (
        <VirtualSelectList
            wrapCss={styled["order-list"]}
            header={Header}
            footer={Footer}
            data={data}
            select={select}
            selectType={selectType}
            renderItem={renderItem}
            selectFields="order_id"
        />
    );
}


function BaseModalFooter({ hotkey }) {
    return (
        <div className={styled["modal-footer"]}>
            {
                hotkey.map(({ status, title, key, fn, type = "primary" }) => (
                    <Button
                        disabled={!status}
                        key={title}
                        type={type}
                        onClick={fn}
                    >
                        {`${title} <${key}>`}
                    </Button>
                ))
            }
        </div>
    );
}