import { devConfig } from "./dev.env";
import { prodConfig } from "./prod.env";

let config;

switch (process.env.NODE_ENV) {
    case "production":
        config = prodConfig;
        break;
    case "development":
        config = devConfig;
        break;
    default:
        config = prodConfig;
}

export default config;
export { config };