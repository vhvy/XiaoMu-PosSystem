import Koa from "koa";
import config from "@/config/index";
import { HttpMethod } from "@/constants/index";
import { URL } from "url";

const { allowOriginHost } = config;

const isValidHost = (origin: string): boolean => {
    try {
        const url = new URL(origin);
        return allowOriginHost.includes(url.host);
    } catch (error) {
        return false;
    }
};

export default async (ctx: Koa.Context, next: Koa.Next) => {
    const headers = ctx.headers;
    if (headers.origin) {
        if (isValidHost(headers.origin)) {
            ctx.set("access-control-allow-origin", headers.origin);

            if (headers['access-control-request-headers']) {
                ctx.set("access-control-allow-headers", headers['access-control-request-headers']);
            }

            if (headers["access-control-request-method"]) {
                ctx.set("access-control-allow-methods", headers["access-control-request-method"]);
            }

            if (ctx.method.toLowerCase() === HttpMethod.options) {
                ctx.status = 204;
            } else {
                await next();
            }
        } else {
            ctx.status = 403;
        }
    } else {
        await next();
    }
};