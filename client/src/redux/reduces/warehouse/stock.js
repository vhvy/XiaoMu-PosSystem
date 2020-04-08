import {
    WARE_STOCK_REMOVE,
    WARE_STOCK_INIT,
    WARE_STOCK_CLEAN,
    WARE_STOCK_ADD,
    WARE_STOCK_SELECT
} from "../../action/actionType";

const initState = {
    id: 0,
    selectId: -1,
    selectType: "origin",
    list: []
};

export function stock(state = initState, action) {

    function handleInit() {
        let id = 0;
        const list = action.list.map(i => ({
            ...i,
            id: id++
        }));
        return {
            ...state,
            id,
            selectId: -1,
            selectType: "origin",
            list
        };
    }

    function handleDel() {
        const { list, selectId } = state;
        if (list.length < 2) return initState;
        const index = list.findIndex(i => i.id === selectId);
        if (index === list.length - 1) {
            return {
                ...state,
                selectId: list[list.length - 2].id,
                selectType: "origin",
                list: list.filter(i => i.id !== selectId)
            };
        } else {
            return {
                ...state,
                selectId: list[index + 1].id,
                selectType: "origin",
                list: list.filter(i => i.id !== selectId)
            };
        }
    }

    switch (action.type) {
        case WARE_STOCK_ADD:
            return {
                ...state,
                id: state.id + 1,
                selectId: state.id,
                selectType: "origin",
                list: [...state.list, {
                    ...action.data,
                    id: state.id
                }]
            };
        case WARE_STOCK_INIT:
            return handleInit();
        case WARE_STOCK_REMOVE:
            return handleDel();
        case WARE_STOCK_CLEAN:
            return initState;
        case WARE_STOCK_SELECT:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}