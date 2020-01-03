import { config } from "../config";

const { GLOBAL_TOKEN_KEY } = config;

export class TokenManage {
    static set Token(t) {
        if (t && t !== "") {
            sessionStorage.setItem(GLOBAL_TOKEN_KEY, t);
        } else {
            sessionStorage.removeItem(GLOBAL_TOKEN_KEY);
        }
    }

    static get Token() {
        const token = sessionStorage.getItem(GLOBAL_TOKEN_KEY);
        return (token && token !== "") ? token : undefined;
    }

    static async validToken(http) {
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

    static clean() {
        this.Token = undefined;
    }
}