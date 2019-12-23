import {
    LOGIN_SET_CURRENT_USERNAME,
    LOGIN_SET_CURRENT_USER_AUTHORITY,
    CLEAR_USER_STATE
} from "../action/actionType";
import { moduleList } from "../../../../server/config/moduleList";

export function setCurrentUserDetails(state = {
    username: "",
    authority: []
}, action) {
    switch (action.type) {
        case LOGIN_SET_CURRENT_USERNAME:
            return {
                username: action.username,
                authority: [...state.authority]
            };
        case LOGIN_SET_CURRENT_USER_AUTHORITY:
            return {
                username: state.username,
                authority: [...action.authority]
            };
        case CLEAR_USER_STATE:
            return {
                username: "",
                authority: []
            }
        default:
            return state;
    }
}