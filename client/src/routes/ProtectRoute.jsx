import React from "react";
// import { message } from "antd";
import { Route, Redirect } from "react-router-dom";
import { TokenManage } from "../tasks/tokenManage";
import { useAuth } from "../views/AuthProvider";

let flag = true;
// 是否是首次打开应用

function ProtectRoute({ component: Component, path, ...rest }) {
    const token = TokenManage.Token;
    const { isLogin } = useAuth();
    let bool = true;

    if (flag) {
        if (!token) {
            bool = false;
        }
    } else {
        if (!isLogin) {
            bool = false;
        }
    }

    return bool ? (<Route {...rest} component={Component} />) : (
        <Redirect from={path} to={{
            pathname: "/login",
            state: {
                from: path
            }
        }} />);
}


export { ProtectRoute };
export default ProtectRoute;