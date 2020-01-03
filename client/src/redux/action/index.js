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
    TOGGLE_TABS_STATUS
} from "./actionType";

export function toggleTabsStatusAction(status) {
    return {
        type: TOGGLE_TABS_STATUS,
        status
    }
}

export function closeTabAction(path) {
    // 关闭一个栏目
    return {
        type: TABS_CLOSE_TAB,
        path
    }
}

export function openTabAction(value) {
    // 打开一个新的栏目
    return {
        type: TABS_ADD_TAB,
        value
    }
}

export function toggleTabAction(path) {
    // 设置当前展示的栏目
    return {
        type: TABS_SET_CURRENT_TAB,
        path
    }
}

export function setUserDetailsAction(value) {
    // 设置用户信息
    return {
        type: SET_USER_DETAILS,
        value
    }
}

export function setUserIsAdminAction(isAdmin) {
    // 设置当前用户是否为管理员
    return {
        type: USER_SET_IS_ADMIN,
        isAdmin
    }
}

export function setUserIsLoginAction(login) {
    // 设置用户登录状态
    return {
        type: LOGIN_SET_USER_IS_LOGIN,
        login
    }
}

export function clearUserLoginStateAction() {
    // 清除用户登录状态
    return {
        type: CLEAR_USER_STATE
    }
}

export function setApiUrlAction(data) {
    // 设置当前API地址
    return {
        type: LOGIN_SET_API_URL,
        data
    }
}

export function setCurrentUsernameAction(username) {
    // 设置当前用户名

    return {
        type: LOGIN_SET_CURRENT_USERNAME,
        username
    }
}

export function setCurrentUserAuthorityAction(authority) {
    // 设置当前用户权限列表

    return {
        type: LOGIN_SET_CURRENT_USER_AUTHORITY,
        authority
    }
}