import React from "react";
import { message } from "antd";
import { Route, Redirect } from "react-router-dom";
import { config } from "../config";

const { GLOBAL_TOKEN_KEY } = config;

function ProtectRoute({ component: Component, ...rest }) {
    const token = sessionStorage.getItem(GLOBAL_TOKEN_KEY);
    if (!token) {
        message.info("请先登录!");
        console.log(config);
        return <Redirect to="/login" />
    } else {
        return (<Route
            {...rest}
            component={Component}
        />);
    }

}

export { ProtectRoute };
export default ProtectRoute;