import { combineReducers } from "redux";
import { setApiUrl } from "./setApiUrl";
import { setCurrentUserDetails } from "./setUserDetails";
import { setModule } from "./setModule";

export const reduces = combineReducers({
    apiUrl: setApiUrl,
    userDetails: setCurrentUserDetails,
    modules: setModule
});