import { SET_STORE_NAME } from "../action/actionType";

export function store_name(state = "小牧超市", action) {

    switch (action.type) {
        case SET_STORE_NAME:
            return action.name;
        default:
            return state;
    }
}