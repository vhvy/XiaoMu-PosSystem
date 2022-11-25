import { MIDDLEWARE_KEY } from "@/constant/decorator";
import type { RouterContext } from "@koa/router";
import { Next } from "koa";

export type Middleware = (ctx: RouterContext, next: Next) => Promise<any>;


export const use = (middleware: Middleware): MethodDecorator => {
    return (target, key) => {
        const middlewareList: Middleware[] = Reflect.getMetadata(MIDDLEWARE_KEY, target, key) || [];
        middlewareList.push(middleware);

        Reflect.defineMetadata(MIDDLEWARE_KEY, middlewareList, target, key);
    }
}

export const unifyUse = (middleware: Middleware): ClassDecorator => {
    return (target) => {
        const middlewareList: Middleware[] = Reflect.getMetadata(MIDDLEWARE_KEY, target) || [];
        middlewareList.push(middleware);

        Reflect.defineMetadata(MIDDLEWARE_KEY, middlewareList, target);
    }
}