import type { RouterContext } from "@koa/router";

type Response = Array<any> | object;

export type Controller<T extends string> = {
    [key in T]: (ctx: RouterContext) => Promise<Response>
}