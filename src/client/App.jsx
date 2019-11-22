import React from "react";
import zhCN from "antd/es/locale/zh_CN";
import "antd/dist/antd.css";
import "./styles/master.css";
import { ConfigProvider } from "antd";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { routes } from "./routes";
import { ProtectRoute } from "./routes/ProtectRoute";

export default function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        {
                            routes.map(({ path, component, isPrivate, exact = true }, i) => (
                                isPrivate ? <ProtectRoute
                                    key={i}
                                    path={path}
                                    component={component}
                                    exact={exact}
                                /> :
                                    <Route
                                        key={i}
                                        path={path}
                                        component={component}
                                        exact
                                    />
                            ))}
                    </Switch>
                </BrowserRouter>
            </Provider>
        </ConfigProvider >
    );
}