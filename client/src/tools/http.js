import Axios from "axios";
import { config } from "../config";
import { TokenManage } from "../tasks/tokenManage";
import { message as antdMessage } from "antd";

const { baseURL, GLOBAL_BASE_URL_KEY } = config;

const instance = Axios.create({
    baseURL,
    timeout: 3000
});

instance.interceptors.request.use(function (request) {
    const userToken = TokenManage.Token;
    if (userToken) {
        request.headers["Authorization"] = userToken;
    }
    // 从sessionStorage中获取token
    const newBaseURL = localStorage.getItem(GLOBAL_BASE_URL_KEY);
    if (newBaseURL) request.baseURL = newBaseURL;
    // 从localStorage中获取新API地址
    return request;
}, function (err) {
    return Promise.reject(err.response);
});

instance.interceptors.response.use(function (response) {
    return response;
}, function (err) {

    const { response } = err;
    if (!response) {
        antdMessage.error("未知错误!");
        return Promise.reject({
            data: {
                message: "未知错误!"
            }
        });
    }
    
    const { status, data } = response;
    const { message } = data;
    
    if (status >= 400 && status < 500) {
        antdMessage.error(message ? message : "未知错误!");
    }
    return Promise.reject(response);
})

const http = {
    get: (url) => {
        return instance.get(url);
    },
    post: (url, data) => {
        return instance.post(url, data);
    }
};

export { http };
export default http;