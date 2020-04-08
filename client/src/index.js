import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.render((
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider >
), document.getElementById("root"));