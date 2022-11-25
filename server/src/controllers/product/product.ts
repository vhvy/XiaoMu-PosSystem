import { controller } from "@/decorator/controller";
import { get } from "@/decorator/request";
import { use, unifyUse } from "@/decorator/use";
import auth from "@/middleware/auth";
import ProductServices from "@/services/product/ProductServices";
import type { RouterContext } from "@koa/router";

@controller("/product")
@unifyUse(auth)
export class ProductController {

    @get("/list")
    async getList(ctx: RouterContext) {
        const { page = 1, limit = 20 } = ctx.query;
        const where = {
            page: Number(page),
            limit: Number(limit),
        };
        const result = await ProductServices.getProductList(where);
        return result;
    }
}