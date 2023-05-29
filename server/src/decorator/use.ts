import { MIDDLEWARE_KEY } from "@/constant/decorator";
import type { RouterContext } from "@koa/router";
import { Next } from "koa";

export type Middleware = (ctx: RouterContext, next: Next) => Promise<any>;

/**
 * 为方法保存中间件
 * @param middleware 中间件
 * @returns MethodDecorator
 */
export const use = (middleware: Middleware): MethodDecorator => {
    return (target, key) => {
        const middlewareList: Middleware[] = Reflect.getMetadata(MIDDLEWARE_KEY, target, key) || [];
        middlewareList.push(middleware);

        Reflect.defineMetadata(MIDDLEWARE_KEY, middlewareList, target, key);
    }
}


/**
 * 为控制器内的所有方法保存中间件
 * @param middleware 中间件
 * @param excludes 要排除的方法名称
 * @returns ClassDecorator
 */
export const unifyUse = <T extends string>(middleware: Middleware, excludes: Array<T> = []): ClassDecorator => {
    return (target) => {
        Object
            .getOwnPropertyNames(target.prototype)
            .filter(n => n != "constructor")
            .forEach(key => {
                if (excludes.includes(key as T)) return;

                const middlewareList: Middleware[] = Reflect.getMetadata(MIDDLEWARE_KEY, target.prototype, key) || [];
                middlewareList.unshift(middleware);

                Reflect.defineMetadata(MIDDLEWARE_KEY, middlewareList, target.prototype, key);
            });
    }
}