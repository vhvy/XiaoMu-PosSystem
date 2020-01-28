import {
    WARE_COMMODITY_SELECT,
    WARE_COMMODITY_CREATE,
    WARE_COMMODITY_DELETE
} from "../../action/actionType";

const initState = {
    selectId: -1,
    selectType: "origin"
};

export function commodity(state = initState, action) {
    switch (action.type) {
        case WARE_COMMODITY_SELECT:
            return {
                ...state,
                selectId: action.data.selectId,
                selectType: action.data.selectType
            };
        case WARE_COMMODITY_CREATE:
            return {
                ...initState,
                selectId: action.id
            };
        case WARE_COMMODITY_DELETE:
            return {
                ...initState,
                selectId: action.id
            };
        default:
            return state;
    }
}