import { PATH_KEY, METHOD_KEY, MIDDLEWARE_KEY, VALIDATE_KEY } from "@/constant/decorator";
import router from "@/router/router";
import { RequestMethod } from "@/decorator/request";
import { Middleware } from "@/decorator/use";
import config from "@/config/index";
import response from "@/middleware/response";
import createValidate from "@/middleware/validate";
import type { ObjectSchema } from "joi";


export const controller = (prefix: string): ClassDecorator => {
    return (target) => {
        Object
            .getOwnPropertyNames(target.prototype)
            .filter(n => n != "constructor")
            .forEach(name => {
                const path = Reflect.getMetadata(PATH_KEY, target.prototype, name);
                const method: RequestMethod = Reflect.getMetadata(METHOD_KEY, target.prototype, name);

                const middlewareList: Middleware[] = Reflect.getMetadata(MIDDLEWARE_KEY, target.prototype, name) || [];

                const validatorList: ObjectSchema[] = Reflect.getMetadata(VALIDATE_KEY, target.prototype, name) || [];

                const combineMiddlewareList = [
                    response,
                    ...middlewareList
                ];

                if (validatorList.length) {
                    combineMiddlewareList.push(
                        createValidate(validatorList, method)
                    );
                }

                if (path !== undefined && method) {
                    const handler = target.prototype[name];
                    const fullPath = config.globalPrefix + prefix + path;
                    router[method](fullPath, ...combineMiddlewareList, handler);
                }
            });
    };
}