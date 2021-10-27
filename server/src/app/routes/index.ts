import Koa from "koa";
import Router from "@koa/router";
import * as controllers from "@/app/controllers/index";
import { ControllerKey, HttpMethod } from "@/constants/index";
import { getClassMethodsName, getFnMiddlewaresName, getMiddlewares } from "@/utils/utils";
import { KoaCtx, KoaNext } from "@/base/BaseController";

const router = new Router();
type moduleName = keyof typeof controllers;

// 获取控制器模块名
Object.getOwnPropertyNames(controllers)
    .forEach((key) => {

        const controller = controllers[key as moduleName];
        const prototype = controller.prototype;

        type handler = keyof typeof prototype;

        // 从控制器handler上获取元数据，将其传递给路由
        const methods = getClassMethodsName(controller);

        methods.forEach((fnName: handler) => {
            const fn = prototype[fnName] as Function;

            const path: string = Reflect.getMetadata(ControllerKey.PATH, fn);
            const method: HttpMethod = Reflect.getMetadata(ControllerKey.METHOD, fn);
            const handle = async (ctx: KoaCtx, next: KoaNext) => {
                const instance = new controller(ctx, next) as any; // 待修改
                await instance[fnName]();
            };
            const middlewaresName = getFnMiddlewaresName(fn);

            const middlewares: Koa.Middleware[] = getMiddlewares(middlewaresName);

            path && method && router[method](path, ...middlewares, handle);
        });
    });

export default (app: Koa) => {
    app.use(router.routes());
}