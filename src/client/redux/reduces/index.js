import { combineReducers } from "redux";
import { setApiUrl } from "./setApiUrl";

export const reduces = combineReducers({
    apiUrl: setApiUrl
});