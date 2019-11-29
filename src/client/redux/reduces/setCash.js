import { combineReducers } from "redux";
import {
    CASH_SET_CURRENT_ORDER_NUMBER,
    CASH_ADD_ORDER_COMMODITY,
    CASH_DELETE_ORDER_COMMODITY,
    CASH_INPUT_BARCODE,
    CASH_CHECK_MODAL_STATUS,
    CASH_RESTE_STATE,
    CASH_SET_GUEST_PAY_AMOUNT,
    CASH_SET_CURRENT_PAY_AMOUNT,
    CASH_SET_CURRENT_PAY_AMOUNT_ACTUAL,
    CASH_SET_GIVE_GUEST_CHANGE
} from "../action/actionType";

function giveGuestChange(state = 0, action) {
    switch (action.type) {
        case CASH_SET_GIVE_GUEST_CHANGE:
            return action.num;
        case CASH_RESTE_STATE:
            return 0;
        default:
            return state;
    }
}

function orderPayAmountActual(state = 0, action) {
    switch (action.type) {
        case CASH_SET_CURRENT_PAY_AMOUNT_ACTUAL:
            return action.num;
        case CASH_RESTE_STATE:
            return 0;
        default:
            return state;
    }
}

function orderPayAmount(state = 0, action) {
    switch (action.type) {
        case CASH_SET_CURRENT_PAY_AMOUNT:
            return action.num;
        case CASH_RESTE_STATE:
            return 0;
        default:
            return state;
    }
}

function guestPayAmount(state = 0, action) {
    switch (action.type) {
        case CASH_SET_GUEST_PAY_AMOUNT:
            return action.num;
        case CASH_RESTE_STATE:
            return 0;
        default:
            return state;
    }
}

function setCashCheckModalStatus(state = true, action) {
    switch (action.type) {
        case CASH_CHECK_MODAL_STATUS:
            return action.show;
        default:
            return state;
    }
}

function currentOrderNumber(state = 0, action) {
    switch (action.type) {
        case CASH_SET_CURRENT_ORDER_NUMBER:
            return action.order_number;
        default:
            return state;
    }
}


let commodityIndex = 0;
function currentOrderCommodityList(state = [
    {
        name: "测试商品1",
        price: 12.2,
        count: 2
    }
], action) {
    let newCommodityDetails;
    switch (action.type) {
        case CASH_ADD_ORDER_COMMODITY:
            newCommodityDetails = Object.assign({}, action.commodity, {
                index: commodityIndex++
            })
            return [...state, newCommodityDetails];
        case CASH_DELETE_ORDER_COMMODITY:
            return state.filter(c => c.index !== action.index);
        case CASH_RESTE_STATE:
            return [];
        default:
            return state;
    }
}

function currentInputBarcode(state = "", action) {
    switch (action.type) {
        case CASH_INPUT_BARCODE:
            return action.barcode;
        default:
            return state;
    }
}

const checkState = combineReducers({
    guestPayAmount,
    orderPayAmount,
    orderPayAmountActual,
    giveGuestChange
});

const fnModalStatus = combineReducers({
    checkModalStatus: setCashCheckModalStatus
});

export const setCash = combineReducers({
    currentOrderNumber,
    currentOrderCommodityList,
    currentInputBarcode,
    fnModalStatus,
    checkState
});