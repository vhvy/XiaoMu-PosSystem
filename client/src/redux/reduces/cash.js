import { combineReducers } from "redux";
import {
    CASH_HOTKEY_STATUS,
    CASH_ORDER_ADD_COMMODITY,
    CASH_ORDER_DELETE_COMMODITY,
    CASH_ORDER_SET_SELECT_COMMODITY,
    CASH_ORDER_SET_COMMODITY_COUNT,
    CASH_ORDER_SET_COMMODITY_PRICE,
    CASH_ORDER_SET_COMMODITY_STATUS_GIVE,
    CASH_ORDER_SET_COMMODITY_STATUS_RETURN,
    CASH_ORDER_SET_VIP,
    CASH_ORDER_CLEAR_VIP,
    CASH_ORDER_RESET_STATUS,
    CASH_HISTORY_ORDER_INIT,
    CASH_HISTORY_ORDER_ADD,
    CASH_HISTORY_ORDER_UNDO,
    CASH_ORDER_HANGUP,
    CASH_ORDER_HANGWUP_GET,
    CASH_HISTORY_ORDER_ADDVIP,
    CASH_HISTORY_ORDER_IMPORT
} from "../action/actionType";
import config from "../../config";
import { mathc } from "../../tools/mathc";
import { getFormatTime } from "../../tools/time";

const { GLOBAL_CASH_HOTKEY_SHOW } = config;

const cashHotKeyInitStatus = localStorage.getItem(GLOBAL_CASH_HOTKEY_SHOW) === "hide" ? false : true;

export function showCashHotKey(state = cashHotKeyInitStatus, action) {

    switch (action.type) {
        case CASH_HOTKEY_STATUS:
            return action.show;
        default:
            return state;
    }
}

const orderInit = {
    id: 0,
    select: {
        type: "origin",
        id: 0
    },
    vip: {},
    commodityList: []
}

function currentOrder(state = orderInit, action) {

    switch (action.type) {
        case CASH_HISTORY_ORDER_IMPORT:
            return (() => {
                let id = state.id;
                const commodityList = [...state.commodityList];
                for (let item of action.data) {
                    commodityList.push(Object.assign({}, item, {
                        id: ++id
                    }));
                }
                return {
                    ...state,
                    id,
                    select: {
                        type: "origin",
                        id
                    },
                    commodityList
                }
            })();
        case CASH_ORDER_ADD_COMMODITY:
            return {
                ...state,
                commodityList: [
                    ...state.commodityList,
                    Object.assign({}, action.commodity, {
                        id: state.id + 1,
                        count: 1,
                        money: action.commodity.sale_price
                    })
                ],
                id: state.id + 1,
                select: {
                    type: "origin",
                    id: state.id + 1
                }
            };
        case CASH_ORDER_DELETE_COMMODITY:
            return (() => {
                if (action.id !== state.select.id) {
                    return {
                        ...state,
                        commodityList: state.commodityList.filter(({ id }) => id !== action.id)
                    };
                } else {
                    const index = state.commodityList.findIndex(({ id }) => id === action.id);
                    let select;
                    const len = state.commodityList.length;
                    if (len === 1) {
                        // 当商品只有一个时恢复select 为0
                        select = 0;
                    } else if (index === len - 1) {
                        // 当商品是商品列表里最后一个时，将select设为被删商品的前一个商品id
                        select = state.commodityList[len - 2].id;
                    } else {
                        // 将select设为被删商品的后一个商品id
                        select = state.commodityList[index + 1].id
                    }
                    return {
                        ...state,
                        commodityList: state.commodityList.filter(({ id }) => id !== action.id),
                        select: {
                            type: "origin",
                            id: select
                        }
                    };
                }
            })();
        case CASH_ORDER_SET_SELECT_COMMODITY:
            return {
                ...state,
                select: {
                    type: action.select.type,
                    id: action.select.id
                }
            };
        case CASH_ORDER_SET_COMMODITY_COUNT:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {

                        return Object.assign({}, i, {
                            count: action.count,
                            money: (() => {
                                switch (i.status) {
                                    case "赠送":
                                        return 0;
                                    case "退货":
                                        return mathc.multiply(0 - mathc.abs(i.sale_price), action.count);
                                    default:
                                        return mathc.multiply(i.sale_price, action.count);
                                }
                            })()
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_COMMODITY_PRICE:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {
                        return Object.assign({}, i, {
                            sale_price: action.price,
                            money: (() => {
                                switch (i.status) {
                                    case "赠送":
                                        return 0;
                                    case "退货":
                                        return mathc.multiply(0 - mathc.abs(action.price), i.count);
                                    default:
                                        return mathc.multiply(action.price, i.count);
                                }
                            })()
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_COMMODITY_STATUS_GIVE:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {
                        return Object.assign({}, i, {
                            status: "赠送",
                            sale_price: 0,
                            money: 0
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_COMMODITY_STATUS_RETURN:
            return {
                ...state,
                commodityList: state.commodityList.map(i => {
                    if (i.id === state.select.id) {
                        return Object.assign({}, i, {
                            status: "退货",
                            sale_price: 0 - i.sale_price,
                            money: mathc.multiply(i.count, 0 - i.sale_price)
                        });
                    }
                    return i;
                })
            };
        case CASH_ORDER_SET_VIP:
            return {
                ...state,
                vip: action.vip
            };
        case CASH_ORDER_CLEAR_VIP:
            return {
                ...state,
                vip: {}
            };
        case CASH_ORDER_RESET_STATUS:
        case CASH_ORDER_HANGUP:
            return orderInit;
        case CASH_ORDER_HANGWUP_GET:
            return {
                ...orderInit,
                id: action.data.order_id,
                select: {
                    type: "origin",
                    id: action.data.commodityList[0].id
                },
                vip: action.data.vip,
                commodityList: action.data.commodityList
            }
        default:
            return state;
    }
}



function historyOrder(state = [], action) {
    switch (action.type) {
        case CASH_HISTORY_ORDER_INIT:
            return action.data;
        case CASH_HISTORY_ORDER_ADD:
            return [...state, action.order];
        case CASH_HISTORY_ORDER_UNDO:
        case CASH_HISTORY_ORDER_ADDVIP:
            return state.map(order => {
                if (order.order_id === action.data.order_id) {
                    return action.data;
                }
                return order;
            });
        default:
            return state;
    }
}

const hangupInitState = {
    id: 0,
    list: []
};

function hangupOrder(state = hangupInitState, action) {

    switch (action.type) {
        case CASH_ORDER_HANGUP:
            return {
                id: state.id + 1,
                list: [...state.list, {
                    id: state.id + 1,
                    order_id: action.data.id,
                    vip: action.data.vip,
                    commodityList: action.data.commodityList,
                    time: getFormatTime()
                }]
            };
        case CASH_ORDER_HANGWUP_GET:
            return {
                ...state,
                list: state.list.filter(({ id }) => id !== action.id)
            };
        default:
            return state;
    }
}

export const cash = combineReducers({
    currentOrder,
    historyOrder,
    hangupOrder
});