import merge from "webpack-merge";
import { common } from "./common.env";

export const devConfig = merge(common, {
    baseURL: "http://127.0.0.1:8888"
});