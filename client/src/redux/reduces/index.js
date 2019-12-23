import { combineReducers } from "redux";
import { setApiUrl } from "./setApiUrl";
import { setCurrentUserDetails } from "./setUserDetails";
import { setUserIsLogin } from "./setUserIsLogin";

export const reduces = combineReducers({
    apiUrl: setApiUrl,
    userDetails: setCurrentUserDetails,
    isLogin: setUserIsLogin
});