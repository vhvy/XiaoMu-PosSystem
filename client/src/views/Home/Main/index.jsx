import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import { menuValue } from "../menus";

const { router } = menuValue;
const { Content } = Layout;

export function Main() {

    return (
        <Content style={{
            margin: 10,
            height: "100%",
            minHeight: 480
        }}>
            <Switch>
                {
                    router
                        .filter(({ component }) => component)
                        .map(
                            ({ path, component }) =>
                                <Route key={path} exact path={path} component={component} />
                        )
                }
                <Redirect to="/home" />
            </Switch>
        </Content>
    );
}