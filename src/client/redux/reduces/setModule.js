import { HOME_CLOSE_MODULE, HOME_TOGGLE_CURRENT_MODULE, HOME_OPEN_MODULE } from "../action/actionType";

export function setModule(state = {
    current: "前台销售",
    moduleList: ["系统主页", "前台销售"]
}, action) {
    let newList;
    switch (action.type) {
        case HOME_OPEN_MODULE:
            return {
                current: action.name,
                moduleList: [...state.moduleList, action.name]
            };
        case HOME_CLOSE_MODULE:
            newList = state.moduleList.filter(name => name !== action.name);
            return {
                current: state.current === action.name ? newList[newList.length - 1] : state.current,
                moduleList: newList
            };
        case HOME_TOGGLE_CURRENT_MODULE:
            return {
                current: action.name,
                moduleList: [...state.moduleList]
            };
        default:
            return state;
    }
}