import { config } from "../config";
import { message } from "antd";

const { GLOBAL_TOKEN_KEY } = config;

export class UserAuth {
    static set Token(t) {
        if (t) {
            sessionStorage.setItem(GLOBAL_TOKEN_KEY, t);
        } else {
            sessionStorage.removeItem(GLOBAL_TOKEN_KEY);
        }
    }

    static get Token() {
        return sessionStorage.getItem(GLOBAL_TOKEN_KEY);
    }

    static auth(t) {
        this.Token = t;
        // message.success("登录成功!");
    }

    static logout() {
        this.Token = undefined;
        message.success("注销成功!");
    }
}