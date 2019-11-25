import {
    SET_CURRENT_USERNAME,
    SET_CURRENT_USER_AUTHORITY
} from "../action/actionType";
import { moduleList } from "../../../config/moduleList";

export function setCurrentUserDetails(state = {
    username: "admin",
    authority: process.env.NODE_ENV === "development" ? moduleList : []
}, action) {
    switch (action.type) {
        case SET_CURRENT_USERNAME:
            return {
                username: action.username,
                authority: [...state.authority]
            };
        case SET_CURRENT_USER_AUTHORITY:
            return {
                username: state.username,
                authority: [...action.authority]
            };
        default:
            return state;
    }
}