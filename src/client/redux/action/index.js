import { LOGIN_SET_API_URL } from "./actionType";

export function setApiUrlAction(data) {
    return {
        type: LOGIN_SET_API_URL,
        data
    }
}
