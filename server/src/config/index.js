import prodEnv from "./prod.env.js";
import devEnv from "./dev.env.js";
import commonEnv from "./common.js";
import merge from "webpack-merge";

let config;

const env = process.env.NODE_ENV;

switch (env) {
    case "development":
        config = devEnv;
        break;
    case "production":
        config = prodEnv;
        break;
    default:
        config = devEnv;
}

export default merge(commonEnv, config);