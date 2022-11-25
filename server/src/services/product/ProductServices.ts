import Product from "@/model/product/Product";
import { BaseObj } from "@/types/base";
import { getPageParams } from "@/utils";

export default class ProductServices {
    public static async getProductList(query: BaseObj) {
        const list = await Product.findAndCountAll(getPageParams(query));

        return list;
    }
}