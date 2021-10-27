import { MetaKey, MiddlewareKey, ControllerKey } from "@/constants/index";
import { otherMiddlewares } from "@/app/middleware/index";
import Koa from "koa";

// 获取类原型上除构造函数之外的所有方法
export function getClassMethodsName(constructor: Function): string[] {
    const prototype = constructor.prototype;
    const keys = Object.getOwnPropertyNames(prototype);
    return keys.filter(key => key !== MetaKey.CONSTRUCT);
}

// 是否是函数
export const isFunc = (param: any): boolean => typeof param === "function";

// 在方法上为路径增加路由前缀
export function defineFnPathPrefix(fn: Function, prefix: string): void {
    const path: string = Reflect.getMetadata(ControllerKey.PATH, fn);
    const fullPath = prefix + path;
    Reflect.defineMetadata(ControllerKey.PATH, fullPath, fn);
}

// 在方法上定义要加载的中间件名称
export function defineFnMiddlewareData(fn: Function, middlewareName: MiddlewareKey): void {
    let middlewareList = getFnMiddlewaresName(fn);
    !middlewareList.includes(middlewareName) && middlewareList.push(middlewareName);

    Reflect.defineMetadata(MetaKey.MIDDLEWARE, JSON.stringify(middlewareList), fn);
}

// 获取方法上定义的中间价名称
export function getFnMiddlewaresName(fn: Function): MiddlewareKey[] {
    try {
        return JSON.parse(Reflect.getMetadata(MetaKey.MIDDLEWARE, fn));
    } catch (error) {
        return [];
    }
}

// 根据key获取中间件列表
export function getMiddlewares(keys: MiddlewareKey[]): Koa.Middleware[] {
    let middlewares: Koa.Middleware[] = [];

    keys.forEach(k => {
        const item = otherMiddlewares.find(i => i.key === k);
        if (item) {
            middlewares.push(item.fn);
        } else {
            console.error(`Can't find middleware ${k} !`);
        }
    });
    return middlewares;
}