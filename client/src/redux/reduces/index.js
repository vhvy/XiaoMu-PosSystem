import { combineReducers } from "redux";
import { apiUrl } from "./apiUrl";
import { tabs, showTabs } from "./tabs";
import { userDetails } from "./userDetails";
import { showCashHotKey, cash } from "./cash";
import { warehouse } from "./warehouse";
import { store_name } from "./store";

export const reduces = combineReducers({
    apiUrl,
    userDetails,
    tabs,
    showTabs,
    showCashHotKey,
    cash,
    warehouse,
    store_name
});