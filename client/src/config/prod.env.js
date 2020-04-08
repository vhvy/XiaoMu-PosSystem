import merge from "../tools/merge";
import { common } from "./common.env";

export const prodConfig = merge(common, {
    baseURL: "http://127.0.0.1:8888"
})