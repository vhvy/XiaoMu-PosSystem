import { combineReducers } from "redux";
import { apiUrl } from "./apiUrl";
import { tabs, showTabs } from "./tabs";
import { userDetails } from "./userDetails";

export const reduces = combineReducers({
    apiUrl,
    userDetails,
    tabs,
    showTabs
});