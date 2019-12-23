import {
    LOGIN_SET_API_URL,
    LOGIN_SET_CURRENT_USERNAME,
    LOGIN_SET_CURRENT_USER_AUTHORITY,
    LOGIN_SET_USER_IS_LOGIN,
    CLEAR_USER_STATE

} from "./actionType";

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