import React from "react";
import { message } from "antd";
import { Route, Redirect } from "react-router-dom";
import { UserAuth } from "../tools/tokenManage";

function ProtectRoute({ component: Component, ...rest }) {
    const token = UserAuth.Token;
    if (!token) {
        message.info("请先登录!");
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