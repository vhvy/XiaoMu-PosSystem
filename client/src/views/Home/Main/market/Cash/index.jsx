import React, { useState, useMemo } from "react";
import { Row, message } from "antd";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { CashLeft } from "./CashLeft";
import { CashRight } from "./CashRight";
import {
    addCommodityToOrderAction,
    deleteCommodityFromOrderAction,
    setOrderSelectCommodityAction,
    setOrderSelectCommodityCountAction,
    setOrderSelectCommodityPriceAction,
    setOrderSelectCommodityGiveAction,
    setOrderSelectCommodityReturnAction,
    setOrderVipAction,
    clearOrderVipAction,
    resetOrderAction,
    hangupOrderAction
} from "../../../../../redux/action";
import { SetVipModal } from "./Dialog/SetVip";
import { HandUpOrder } from "./Dialog/HangUpOrder";
import { HistoryOrder } from "./Dialog/HistoryOrder";
import { Checkout } from "./Dialog/Checkout";
import { mathc } from "../../../../../tools/mathc";
import { throttle } from "../../../../../tools/throttle";

const warn = throttle(message.warn, 3000);

let inputValue = "";

export function Cash() {

    function selector({ showCashHotKey, cash }) {
        const { historyOrder, currentOrder, hangupOrder } = cash;
        const { vip, select, commodityList, id: tmp_id } = currentOrder;
        return {
            hangupOrder,
            tmp_id,
            showCashHotKey,
            historyOrder,
            vip,
            commodityList,
            select: select.id,
            selectType: select.type
        };
    }

    const [value, _setInputValue] = useState("");

    const [vipModalStatus, setVipModalStatus] = useState(false);
    // 会员Modal的显示状态

    const [checkoutStatus, setCheckModalStatus] = useState(false);
    // 结账界面Modal的显示状态

    const [hangUpStatus, setHangUpStatus] = useState(false);
    // 挂单界面的显示状态

    const [historyOrderStatus, setHistoryOrderStatus] = useState(false);
    // 已完成订单Modal的显示状态

    function hideHistoryOrderModal() {
        // 关闭已完成订单Modal
        setHistoryOrderStatus(false);
    }

    function hideHangUpModal() {
        // 关闭挂单Modal
        setHangUpStatus(false);
    }
    function hideCheckModal() {
        // 关闭结账Modal
        setCheckModalStatus(false);
    }

    function hideVipModal() {
        // 关闭会员Modal
        setVipModalStatus(false);
    }

    function setInputValue(v) {
        inputValue = v;
        _setInputValue(v);
    }

    const {
        hangupOrder,
        showCashHotKey,
        historyOrder,
        vip,
        tmp_id,
        commodityList,
        select,
        selectType
    } = useSelector(selector, shallowEqual);

    const dispatch = useDispatch();

    function addCommodity(c) {
        dispatch(addCommodityToOrderAction(c));
    }

    function setVip(data) {
        dispatch(setOrderVipAction(data));
    }

    function clearVip() {
        dispatch(clearOrderVipAction());
    }

    function clickSelect(id) {
        if (id !== select) {
            dispatch(setOrderSelectCommodityAction({
                type: "click",
                id
            }));
        }
    }

    const hotkey = useMemo(() => {

        function checkout() {
            if (commodityList.length > 0) {
                setCheckModalStatus(true);
            } else {
                message.warn("无商品，不能结账!");
            }
        }

        function deleteCommodity() {

            function fn(id) {
                dispatch(deleteCommodityFromOrderAction(id));
            }

            commodityList.length > 0 && fn(select);
        }

        function openMoneyBox() {
            console.log("打开钱箱!");
        }

        function resetOrder() {
            if (commodityList.length > 0) {
                dispatch(resetOrderAction());
            }
        }

        function changeCount() {
            function fn(count) {
                dispatch(setOrderSelectCommodityCountAction(count));
            }

            const num = Number(inputValue);
            if (commodityList.length > 0 && !Number.isNaN(num) && num > 0 && num <= 999) {
                if (Number.isInteger(num)) {
                    fn(num);
                    setInputValue("");
                } else {
                    const index = inputValue.indexOf(".");
                    const floatBit = inputValue.slice(index + 1).length;
                    if (floatBit > 2) {
                        message.warn("小数位不能超过两位!");
                    } else {
                        fn(num);
                        setInputValue("");
                    }
                }
            }
        }

        function changePrice() {
            function fn(price) {
                dispatch(setOrderSelectCommodityPriceAction(price));
            }

            const num = Number(inputValue);
            if (commodityList.length > 0 && !Number.isNaN(num) && num > 0 && num <= 999) {
                if (Number.isInteger(num)) {
                    fn(num);
                    setInputValue("");
                } else {
                    const index = inputValue.indexOf(".");
                    const floatBit = inputValue.slice(index + 1).length;
                    if (floatBit > 2) {
                        message.warn("小数位不能超过两位!");
                    } else {
                        fn(num);
                        setInputValue("");
                    }
                }
            }
        }

        function showVipModal() {
            setVipModalStatus(true);
        }

        function returnCommodity() {
            if (commodityList.length > 0) {
                dispatch(setOrderSelectCommodityReturnAction());
            }
        }

        function giveCommodity() {
            if (commodityList.length > 0) {
                dispatch(setOrderSelectCommodityGiveAction());
            }
        }

        function upSelect() {
            function fn(id) {
                dispatch(setOrderSelectCommodityAction({
                    type: "up",
                    id
                }));
            }

            if (commodityList.length <= 1) return;
            const index = commodityList.findIndex(({ id }) => id === select);
            if (index === 0) return;
            const { id } = commodityList[index - 1];
            fn(id);
        }

        function downSelect() {

            function fn(id) {
                dispatch(setOrderSelectCommodityAction({
                    type: "down",
                    id
                }));
            }

            if (commodityList.length <= 1) return;
            const index = commodityList.findIndex(({ id }) => id === select);
            if (index === commodityList.length - 1) return;
            const { id } = commodityList[index + 1];
            fn(id);
        }


        function hangUpOrderFn() {
            // 挂单
            if (commodityList.length === 0) {
                if (hangupOrder.list.length === 0) {
                    warn("当前没有挂起订单!");
                } else {
                    setHangUpStatus(true);
                }
            } else {
                dispatch(hangupOrderAction({
                    id: tmp_id,
                    vip,
                    commodityList
                }));
                message.success("挂起订单成功!");
            }
        }

        function showHistoryModal() {
            if (historyOrder.length === 0) {
                warn("今日尚未产生已完成订单!");
            } else {
                setHistoryOrderStatus(true);
            }
        }

        const hotkey = [
            {
                key: "F4",
                label: "清空商品",
                fn: resetOrder
            }, // 清空所有商品
            {
                key: "Delete",
                label: "删除商品",
                fn: deleteCommodity
            }, // 删除
            {
                key: "+",
                label: "结账",
                fn: checkout
            }, // 结账
            {
                key: "F5",
                label: "开钱箱",
                fn: openMoneyBox
            }, // 打开钱箱
            {
                key: "*",
                label: "改数量",
                fn: changeCount
            }, // 修改商品数量/重量
            {
                key: "/",
                label: "改价",
                fn: changePrice
            }, // 修改商品单价
            {
                key: "F9",
                label: "刷会员",
                fn: showVipModal
            }, // 设置当前订单会员
            {
                key: "F7",
                label: "挂单/取单",
                fn: hangUpOrderFn
            }, // 挂起或取出订单
            {
                key: "F6",
                label: "查看订单",
                fn: showHistoryModal
            }, // 列出今日已完成订单
            {
                key: "F11",
                label: "退货",
                fn: returnCommodity
            }, // 对某件商品进行退货
            {
                key: "F12",
                label: "赠送",
                fn: giveCommodity
            }, // 对某件商品进行赠送
            {
                key: "ArrowUp",
                label: "上移",
                show: false,
                fn: upSelect
            }, // 选择上一行商品
            {
                key: "ArrowDown",
                label: "下移",
                show: false,
                fn: downSelect
            } // 选择下一行商品
        ];

        return hotkey;
    }, [commodityList, selectType, select, vip, historyOrder]);


    const Right = useMemo(() => (<CashRight show={showCashHotKey} hotkey={hotkey} count={hangupOrder.list.length} />), [showCashHotKey, hotkey, hangupOrder]);

    const { count, money, origin_price } = useMemo(() => {
        let count = 0;
        let money = 0;
        let origin_price = 0;
        commodityList.map(({ money: item_money, count: item_count, origin_price: item_origin_price }) => {
            count = mathc.add(count, item_count);
            money = mathc.add(money, item_money);
            origin_price = mathc.add(origin_price, mathc.multiply(item_origin_price, item_count));
        });
        return {
            count, money, origin_price
        };
    }, [commodityList]);

    return (
        <Row
            type="flex"
            style={{
                height: "100%",
            }}
        >
            <CashLeft
                value={value}
                setValue={setInputValue}
                addCommodity={addCommodity}
                vip={vip}
                commodityList={commodityList}
                select={select}
                selectType={selectType}
                clickSelect={clickSelect}
                hotkey={hotkey}
                count={count}
                money={money}
            />
            {Right}

            <SetVipModal
                status={vipModalStatus}
                hideFn={hideVipModal}
                setVip={setVip}
                clearVip={clearVip}
            />

            <Checkout
                status={checkoutStatus}
                hideFn={hideCheckModal}
                money={money}
                origin_price={origin_price}
                list={commodityList}
                vipCode={vip.code}
            />

            <HandUpOrder
                status={hangUpStatus}
                hideFn={hideHangUpModal}
                list={hangupOrder.list}
            />

            <HistoryOrder
                status={historyOrderStatus}
                hideFn={hideHistoryOrderModal}
                list={historyOrder}
            />
        </Row>
    );
}