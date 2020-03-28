import React, { createContext, useContext } from "react";
import { useAuth } from "../AuthProvider";
import axios from "axios";
import { TokenManage } from "../../tasks/tokenManage";
import config from "../../config";
import { message as antdMessage } from "antd";
import { useLocation } from "react-router-dom";

const { baseURL, GLOBAL_BASE_URL_KEY } = config;

const instance = axios.create({
    baseURL
});

let reqFlag, resFlag;

export const AjaxContext = createContext();

export const useAjax = () => useContext(AjaxContext);

export function AjaxProvider({ children }) {
    const location = useLocation();
    const { logout } = useAuth();
    function onReq(request) {
        const token = TokenManage.Token;
        if (token) {
            request.headers["Authorization"] = token;

        }
        // 给请求头加上token

        const newBaseURL = localStorage.getItem(GLOBAL_BASE_URL_KEY);
        if (newBaseURL) request.baseURL = newBaseURL;
        // 从localStorage中获取新API地址

        return request;
    }

    function onReqErr(err) {
        console.log(err, "request");
        return Promise.reject(err);
    }

    function onRes(response) {
        return response;
    }

    function onResErr(err) {
        if (!err.response) {
            antdMessage.error("网络错误");
            return Promise.reject({
                status: false,
                data: {
                    message: "未知错误!"
                }
            });
        }
        const { response } = err;

        const { status, data } = response;
        const { message } = data;

        antdMessage.error(message);

        switch (status) {
            case 401:
                if (location.pathname !== "/login") {
                    logout();
                }
                break;
        }

        return Promise.reject(response);
    }

    if (reqFlag === undefined) {
        reqFlag = instance.interceptors.request.use(onReq, onReqErr);
    }

    if (resFlag === undefined) {
        resFlag = instance.interceptors.response.use(onRes, onResErr);
    }

    const http = {
        get: (url, params) => instance.get(url, {
            params
        }),
        post: (url, data) => instance.post(url, data),
        delete: (url, params) => instance.delete(url, {
            params
        }),
        put: (url, data) => instance.put(url, data)
    };

    return <AjaxContext.Provider value={http} children={children} />
}