import { controller } from "@/decorator/controller";
import { get } from "@/decorator/request";
import { use, unifyUse } from "@/decorator/use";
import auth from "@/middleware/auth";
import koaRouterPkg from "@koa/router";

@controller("/product")
@unifyUse(auth)
export class ProductController {

    @get("/list")
    async getList(ctx: koaRouterPkg.RouterContext) {
        ctx.body = "Hello World!";
    }
}