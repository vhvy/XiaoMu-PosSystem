import { controller } from "@/decorator/controller";
import { get } from "@/decorator/request";
import { unifyUse } from "@/decorator/use";
import validate from "@/decorator/validate";
import auth from "@/middleware/auth";
import ProductServices from "@/services/product/ProductServices";
import { productListSchema } from "@/validator/product/product";
import type { RouterContext } from "@koa/router";

@controller("/product")
@unifyUse(auth)
export class ProductController {

    @validate(productListSchema)
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