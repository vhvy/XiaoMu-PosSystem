import Product from "@/model/product/Product";
import ProductCategory from "@/model/product/ProductCategory";
import { getPageParams } from "@/utils";

interface QueryListParmas {
    page: number,
    limit: number
}

export default class ProductCategoryServices {
    public static async getProductCategoryList(query: QueryListParmas) {
        const list = await ProductCategory.findAndCountAll(getPageParams(query));

        return list;
    }
}