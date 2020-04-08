import { LOGIN_SET_API_URL } from "../action/actionType";

export function apiUrl(state = {
    url: "",
    errors: undefined
}, action) {
    switch (action.type) {
        case LOGIN_SET_API_URL:
            return action.data;
        default:
            return state;
    }
}