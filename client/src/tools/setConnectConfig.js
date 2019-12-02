import { message } from "antd";
import { config } from "../config";

const { GLOBAL_BASE_URL_KEY, baseURL } = config;

export function setConnectConfig(url) {
    if (url.trim() === "") {
        localStorage.setItem(GLOBAL_BASE_URL_KEY, baseURL);
        message.info("服务端地址输入为空，将使用默认地址!");
    } else {
        localStorage.setItem(GLOBAL_BASE_URL_KEY, url);
        message.success("服务端地址设置完成!");
    }
}