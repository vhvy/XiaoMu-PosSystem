import React from "react";
import "antd/dist/antd.css";
import "./styles/master.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { routes } from "./routes";
import { ProtectRoute } from "./routes/ProtectRoute";
import { AuthProvider } from "./views/AuthProvider";
import { AjaxProvider } from "./views/AjaxProvider";
import { Loading } from "./views/Common/Loading";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AjaxProvider>
                    <Loading />
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
                        <Redirect to="/home" />
                    </Switch>
                </AjaxProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;