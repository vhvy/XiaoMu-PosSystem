import { HttpMethod, ControllerKey, MiddlewareKey } from "@/constants/index";
import { getClassMethodsName, defineFnMiddlewareData, defineFnPathPrefix } from "@/utils/utils";
import config from "@/config/index";

// 路由装饰器，根据传入的请求方法和请求路径在类实例方法上添加元数据，供路由使用。
function getRequestDecorator(type: HttpMethod): Function {
    return function (path: string) {
        return function (target: any, key: string) {
            const fn = target[key];

            Reflect.defineMetadata(ControllerKey.PATH, path, fn);
            Reflect.defineMetadata(ControllerKey.METHOD, type, fn);
        };
    }
}

export const get = getRequestDecorator(HttpMethod.get);
export const post = getRequestDecorator(HttpMethod.post);
export const del = getRequestDecorator(HttpMethod.delete);
export const put = getRequestDecorator(HttpMethod.put);


// 鉴权装饰器，为传入的类上所有实例方法增加auth中间件。
export function auth(constructor: Function): void {
    const methods = getClassMethodsName(constructor);
    const prototype = constructor.prototype as object;
    type handler = keyof typeof prototype;

    methods.forEach((fnName: handler) => {
        const fn = prototype[fnName] as Function;
        defineFnMiddlewareData(fn, MiddlewareKey.AUTH);
    });
}

// 路由前缀装饰器，为传入的类上所有实例方法增加路由前缀
export function prefix(prefix: string = ""): Function {
    return (constructor: Function): void => {
        const methods = getClassMethodsName(constructor);
        const prototype = constructor.prototype as object;
        type handler = keyof typeof prototype;

        methods.forEach((fnName: handler) => {
            const fn = prototype[fnName] as Function;
            const fullPrefix = config.prefix + prefix;
            defineFnPathPrefix(fn, fullPrefix);
        });
    }
}