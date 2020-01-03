import webpackMerge from "webpack-merge";
import prodEnv from "./prod.env.js";

export default webpackMerge(prodEnv, {
    allowOriginList: ["http://127.0.0.1:9000", "http://10.1.1.200:9000", "http://localhost:3000"]
});