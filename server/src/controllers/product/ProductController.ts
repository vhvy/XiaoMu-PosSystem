import { controller } from "@/decorator/controller";
import { get } from "@/decorator/request";
import { unifyUse } from "@/decorator/use";
import validate from "@/decorator/validate";
import auth from "@/middleware/auth";
import ProductServices from "@/services/product/ProductServices";
import type { AuthRouterCtx } from "@/types/koa";
import { productListSchema } from "@/validator/product/product";

@controller("/product")
@unifyUse(auth)
export class ProductController {

    @validate(productListSchema)
    @get("/list")
    async getList(ctx: AuthRouterCtx) {
        const { page = 1, limit = 20 } = ctx.query;
        const where = {
            page: Number(page),
            limit: Number(limit),
        };

        const result = await ProductServices.getProductList(where);
        return result;
    }
}