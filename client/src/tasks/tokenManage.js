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

    static validToken(http) {

        return http.get("/api/token/auth");
    }

    static save(t) {
        this.Token = t;
    }

    static clean() {
        this.Token = undefined;
    }
}