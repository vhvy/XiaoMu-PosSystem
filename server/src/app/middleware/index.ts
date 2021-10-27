import Koa from "koa";
import cors from "@/app/middleware/cors";
import handleError from "@/app/middleware/handleError";
import auth from "@/app/middleware/auth";
import { MiddlewareKey } from "@/constants/index";

export interface MiddlewareItem {
    key: MiddlewareKey,
    fn: Koa.Middleware,
};


const globalMiddlewares: MiddlewareItem[] = [
    {
        key: MiddlewareKey.HANDLE_ERROR,
        fn: handleError,
    },
    {
        key: MiddlewareKey.CORS,
        fn: cors,
    }
];

export const otherMiddlewares: MiddlewareItem[] = [
    {
        key: MiddlewareKey.AUTH,
        fn: auth,
    },
];

export default (app: Koa) => {
    globalMiddlewares.forEach(m => {
        app.use(m.fn);
    });
}