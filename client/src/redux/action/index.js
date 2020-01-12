import {
    LOGIN_SET_API_URL,
    LOGIN_SET_CURRENT_USERNAME,
    LOGIN_SET_CURRENT_USER_AUTHORITY,
    LOGIN_SET_USER_IS_LOGIN,
    CLEAR_USER_STATE,
    USER_SET_IS_ADMIN,
    TABS_ADD_TAB,
    TABS_CLOSE_TAB,
    TABS_SET_CURRENT_TAB,
    SET_USER_DETAILS,
    TOGGLE_TABS_STATUS,
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
    CASH_HISTORY_ORDER_ADDVIP,
    CASH_ORDER_HANGUP,
    CASH_ORDER_HANGWUP_GET,
    CASH_HISTORY_ORDER_IMPORT
} from "./actionType";


export function importHistoryOrderAction(data) {
    // 将已完成订单内商品导入前台收款界面
    
    return {
        type: CASH_HISTORY_ORDER_IMPORT,
        data
    }
}

export function addVipToHistoryOrderAction(data) {
    // 为已完成订单追加会员

    return {
        type: CASH_HISTORY_ORDER_ADDVIP,
        data
    }
}

export function getHangupOrderAction({ data, id }) {
    // 取出挂起订单

    return {
        type: CASH_ORDER_HANGWUP_GET,
        data,
        id
    }
}

export function hangupOrderAction(data) {
    // 挂起订单
    return {
        type: CASH_ORDER_HANGUP,
        data
    }
}

export function undoOrderFromHistoryAction(data) {
    // 从历史订单里撤销已完成订单
    return {
        type: CASH_HISTORY_ORDER_UNDO,
        data
    }
}

export function addOrderToHistoryAction(order) {
    // 添加新的已完成订单到历史订单
    return {
        type: CASH_HISTORY_ORDER_ADD,
        order
    };
}

export function initCashHistoryOrderAction(data) {
    // 初始化历史订单信息
    return {
        type: CASH_HISTORY_ORDER_INIT,
        data
    };
}

export function resetOrderAction() {
    // 清空当前订单信息
    return {
        type: CASH_ORDER_RESET_STATUS
    };
}

export function clearOrderVipAction() {
    // 清除当前订单会员信息
    return {
        type: CASH_ORDER_CLEAR_VIP
    };
}

export function setOrderVipAction(vip) {
    // 设置当前订单会员信息
    return {
        type: CASH_ORDER_SET_VIP,
        vip
    }
}

export function setOrderSelectCommodityReturnAction() {
    // 设置当前选中商品状态为退货
    return {
        type: CASH_ORDER_SET_COMMODITY_STATUS_RETURN
    };
}

export function setOrderSelectCommodityGiveAction() {
    // 设置当前选中商品状态为赠送
    return {
        type: CASH_ORDER_SET_COMMODITY_STATUS_GIVE
    };
}

export function setOrderSelectCommodityPriceAction(price) {
    // 设置当前选中商品的单价
    return {
        type: CASH_ORDER_SET_COMMODITY_PRICE,
        price
    };
}

export function setOrderSelectCommodityCountAction(count) {
    // 设置当前选中商品的数量
    return {
        type: CASH_ORDER_SET_COMMODITY_COUNT,
        count
    };
}

export function setOrderSelectCommodityAction(select) {
    // 设置当前选择的商品
    return {
        type: CASH_ORDER_SET_SELECT_COMMODITY,
        select
    };
}

export function deleteCommodityFromOrderAction(id) {
    // 从前台订单里删除商品
    return {
        type: CASH_ORDER_DELETE_COMMODITY,
        id
    };
}

export function addCommodityToOrderAction(commodity) {
    // 向前台订单里添加新的商品
    return {
        type: CASH_ORDER_ADD_COMMODITY,
        commodity
    };
}

export function toggleCashHotKeyStatusAction(show) {
    // 切换前台收银是否显示热键部分
    return {
        type: CASH_HOTKEY_STATUS,
        show
    };
}

export function toggleTabsStatusAction(status) {
    // 切换栏目显示状态
    return {
        type: TOGGLE_TABS_STATUS,
        status
    };
}

export function closeTabAction(path) {
    // 关闭一个栏目
    return {
        type: TABS_CLOSE_TAB,
        path
    };
}

export function openTabAction(value) {
    // 打开一个新的栏目
    return {
        type: TABS_ADD_TAB,
        value
    };
}

export function toggleTabAction(path) {
    // 设置当前展示的栏目
    return {
        type: TABS_SET_CURRENT_TAB,
        path
    };
}

export function setUserDetailsAction(value) {
    // 设置用户信息
    return {
        type: SET_USER_DETAILS,
        value
    };
}

export function setUserIsAdminAction(isAdmin) {
    // 设置当前用户是否为管理员
    return {
        type: USER_SET_IS_ADMIN,
        isAdmin
    };
}

export function setUserIsLoginAction(login) {
    // 设置用户登录状态
    return {
        type: LOGIN_SET_USER_IS_LOGIN,
        login
    };
}

export function clearUserLoginStateAction() {
    // 清除用户登录状态
    return {
        type: CLEAR_USER_STATE
    };
}

export function setApiUrlAction(data) {
    // 设置当前API地址
    return {
        type: LOGIN_SET_API_URL,
        data
    };
}

export function setCurrentUsernameAction(username) {
    // 设置当前用户名

    return {
        type: LOGIN_SET_CURRENT_USERNAME,
        username
    };
}

export function setCurrentUserAuthorityAction(authority) {
    // 设置当前用户权限列表

    return {
        type: LOGIN_SET_CURRENT_USER_AUTHORITY,
        authority
    };
}