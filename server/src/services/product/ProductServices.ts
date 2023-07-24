import Product from "@/model/product/Product";
import { getPageParams } from "@/utils";

export default class ProductServices {
    public static async getProductList(query: AnyObj) {
        const list = await Product.findAndCountAll(getPageParams(query));

        return list;
    }
}