import { controller } from "@/decorator/controller";
import { get } from "@/decorator/request";
import { unifyUse } from "@/decorator/use";
import validate from "@/decorator/validate";
import auth from "@/middleware/auth";
import ProductCategoryServices from "@/services/product/ProductCategoryServices";
import type { AuthRouterCtx } from "@/types/koa";
import { productCategoryListSchema } from "@/validator/product/productCategory";

@controller("/product.category")
@unifyUse(auth)
export class ProductCategoryController {

    @validate(productCategoryListSchema)
    @get("")
    async getList(ctx: AuthRouterCtx) {
        const { page = 1, limit = 20 } = ctx.query;
        const where = {
            page: Number(page),
            limit: Number(limit),
        };

        const result = await ProductCategoryServices.getProductCategoryList(where);
        return result;
    }
}