import {
    WARE_COMMODITY_SELECT
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
        default:
            return state;
    }
}