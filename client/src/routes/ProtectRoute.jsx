import React from "react";
import { message } from "antd";
import { Route, Redirect } from "react-router-dom";
import { TokenManage } from "../tasks/tokenManage";

function ProtectRoute({ component: Component, path, ...rest }) {
    const token = TokenManage.Token;
    if (!token) {
        message.info("请先登录!");
        return <Redirect from={path} to={{
            pathname: "/login",
            state: {
                from: path
            }
        }} />
    } else {
        return (<Route
            {...rest}
            component={Component}
        />);
    }

}

export { ProtectRoute };
export default ProtectRoute;