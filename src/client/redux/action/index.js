import {
    LOGIN_SET_API_URL,
    SET_CURRENT_USERNAME,
    SET_CURRENT_USER_AUTHORITY,
    HOME_CLOSE_MODULE,
    HOME_OPEN_MODULE,
    HOME_TOGGLE_CURRENT_MODULE
} from "./actionType";

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