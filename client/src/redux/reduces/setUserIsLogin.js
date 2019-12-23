import { LOGIN_SET_USER_IS_LOGIN } from "../action/actionType";

export function setUserIsLogin(state = false, action) {
    switch (action.type) {
        case LOGIN_SET_USER_IS_LOGIN:
            return action.login;
        default:
            return state;
    }
}