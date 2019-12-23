import { config } from "../config";
import { message } from "antd";
import http from "../tools/http";

const { GLOBAL_TOKEN_KEY } = config;

export class TokenManage {
    static set Token(t) {
        if (t) {
            sessionStorage.setItem(GLOBAL_TOKEN_KEY, t);
        } else {
            sessionStorage.removeItem(GLOBAL_TOKEN_KEY);
        }
    }

    static get Token() {
        const token = sessionStorage.getItem(GLOBAL_TOKEN_KEY);
        return (token || token !== "") ? token : undefined;
    }

    static async validToken() {
        try {
            const result = await http.get("/api/token/auth");
            return result.data;
        } catch (err) {
            return false;
        }
    }

    static save(t) {
        this.Token = t;
    }

    static logout() {
        this.Token = undefined;
        message.success("注销成功!");
    }
}