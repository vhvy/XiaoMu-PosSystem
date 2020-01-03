import {
    USER_SET_IS_ADMIN,
    CLEAR_USER_STATE,
    LOGIN_SET_USER_IS_LOGIN,
    LOGIN_SET_CURRENT_USERNAME,
    LOGIN_SET_CURRENT_USER_AUTHORITY,
    SET_USER_DETAILS
} from "../action/actionType";

const initValue = {
    username: "",
    authority: [],
    isLogin: false,
    isAdmin: false
}


export function userDetails(state = initValue, action) {

    function mergeState(update_state) {
        return Object.assign({}, state, {
            authority: [...state.authority],
            ...update_state,
        })
    }

    switch (action.type) {
        case SET_USER_DETAILS:
            return (() => {
                const { value } = action;
                const keys = Object.keys(value);
                const update_state = {};
                for (let key of keys) {
                    update_state[key] = value[key];
                }

                return mergeState(update_state);
            })();
        case USER_SET_IS_ADMIN:
            return mergeState({
                isAdmin: action.isAdmin
            });
        case LOGIN_SET_USER_IS_LOGIN:
            return mergeState({
                isLogin: action.login
            });
        case LOGIN_SET_CURRENT_USERNAME:
            return mergeState({
                username: action.username
            });
        case LOGIN_SET_CURRENT_USER_AUTHORITY:
            return mergeState({
                authority: action.authority
            });
        case CLEAR_USER_STATE:
            return initValue;
        default:
            return state;
    }
}