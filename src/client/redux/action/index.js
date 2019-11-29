import {
    LOGIN_SET_API_URL,
    SET_CURRENT_USERNAME,
    SET_CURRENT_USER_AUTHORITY,
    HOME_CLOSE_MODULE,
    HOME_OPEN_MODULE,
    HOME_TOGGLE_CURRENT_MODULE,
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
} from "./actionType";

export function setGiveGuestChange(num) {
    return {
        type: CASH_SET_GIVE_GUEST_CHANGE,
        num
    }
}

export function setCurrentOrderPayAmountActualAction(num) {
    return {
        type: CASH_SET_CURRENT_PAY_AMOUNT_ACTUAL,
        num
    };
}

export function setCurrentOrderPayAmountAction(num) {
    return {
        type: CASH_SET_CURRENT_PAY_AMOUNT,
        num
    };
}

export function setGuestPayAmountAction(num) {
    return {
        type: CASH_SET_GUEST_PAY_AMOUNT,
        num
    }
}

export function resetCashState() {
    return {
        type: CASH_RESTE_STATE
    }
}

export function setCashCheckModalStatusAction(show) {
    return {
        type: CASH_CHECK_MODAL_STATUS,
        show
    }
}

export function inputBarcodeAction(barcode) {
    return {
        type: CASH_INPUT_BARCODE,
        barcode
    }
}

export function deleteOrderCommodityAction(index) {
    return {
        type: CASH_DELETE_ORDER_COMMODITY,
        index
    }
}

export function addOrderCommodityAction(commodity) {
    return {
        type: CASH_ADD_ORDER_COMMODITY,
        commodity
    };
}

export function setCurrentOrderNumberAction(order_number) {
    return {
        type: CASH_SET_CURRENT_ORDER_NUMBER,
        order_number
    };
}

export function openModuleAction(name) {
    return {
        type: HOME_OPEN_MODULE,
        name
    }
}

export function closeModuleAction(name) {
    return {
        type: HOME_CLOSE_MODULE,
        name
    }
}

export function toggleCurrentModuleAction(name) {
    return {
        type: HOME_TOGGLE_CURRENT_MODULE,
        name
    }
}

export function setApiUrlAction(data) {
    return {
        type: LOGIN_SET_API_URL,
        data
    }
}

export function setCurrentUsernameAction(username) {
    return {
        type: SET_CURRENT_USERNAME,
        username
    }
}

export function setCurrentUserAuthorityAction(authority) {
    return {
        type: SET_CURRENT_USER_AUTHORITY,
        authority
    }
}