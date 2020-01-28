import express from "express";
import { throwError } from "../../middleware/handleError.js";
import { validBody } from "../../middleware/validBody.js";
import {
    createCommoditySchema,
    updateCommoditySchema,
    deleteCommoditySchema
} from "../../schema/commodity.js";
import CommodityTask from "../../tasks/commodity.js";
import CategoriesTask from "../../tasks/categories.js";
import SuppliersTask from "../../tasks/suppliers.js";
import config from "../../config/index.js";

const { default_all_category } = config;

const route = express.Router();

route.get("/", async (req, res, next) => {
    // 获取所有商品信息

    const { list } = req.query;

    if (!list) {
        return throwError(next, "分类信息不存在!");
    }

    const arr = Array.from(new Set(list.split(",")));
    // console.log(arr);

    if (arr.includes(default_all_category)) {
        // 如果前台传来分类树根节点，则视为请求所有商品

        const list = await CommodityTask.getAllCommodityDetails();
        return res.json(list);
    }

    for (let item of arr) {
        const result = await CategoriesTask.getCategoryDetails(item);
        // 有任何分类不存在直接返回400
        if (!result) {
            return throwError(next, `分类${item}不存在!`);
        }
    }

    const result = await CommodityTask.getCommodityByCategory(arr);

    res.json(result);
});

route.post("/create", validBody(
    createCommoditySchema,
    "商品信息不正确!"
), async (req, res, next) => {
    // 建立新的商品

    const {
        barcode,
        name,
        category_name,
        unit,
        size,
        in_price,
        sale_price,
        vip_points,
        is_delete,
        supplier_name
    } = req.body;


    if (barcode) {
        const validBarcodeResult = await CommodityTask.getCommodityDetails(barcode);
        if (validBarcodeResult) {
            return throwError(next, "此条码已存在!");
        }
        // 条码存在时返回400
    }

    const validCategoryResult = await CategoriesTask.getCategoryDetails(category_name);
    if (!validCategoryResult) {
        return throwError(next, "分类不存在!");
    }
    // 当分类不存在时返回400

    if (supplier_name) {
        const validSupplierResult = await SuppliersTask.getSupplierDetails(supplier_name);
        if (!validSupplierResult) {
            return throwError(next, "供应商不存在!");
        }
    }
    // 当提交的供应商不存在时返回400

    const { lastID } = await CommodityTask.createCommodity({
        barcode,
        name,
        category_id: validCategoryResult.id,
        unit,
        size,
        in_price,
        sale_price,
        vip_points,
        is_delete,
        supplier_name
    });

    const queryCommodityResult = await CommodityTask.getCommodityDetails(lastID, "id");

    res.json(queryCommodityResult);
});

route.put("/update", validBody(
    updateCommoditySchema,
    "提交的商品信息不正确或不完整!"
), async (req, res, next) => {
    // 更新商品信息

    const { current_barcode, update_value } = req.body;
    const {
        barcode,
        name,
        category_name,
        unit,
        size,
        in_price,
        sale_price,
        vip_points,
        is_delete,
        supplier_name
    } = update_value;


    const validBarcodeResult = await CommodityTask.getCommodityDetails(current_barcode);
    if (!validBarcodeResult) {
        return throwError(next, "此条码不存在!");
    }
    // 需要修改的商品条码不存在时返回400

    if (category_name) {
        const validCategoryResult = await CategoriesTask.getCategoryDetails(category_name);
        if (!validCategoryResult) {
            return throwError(next, "分类不存在!");
        }
        // 当分类不存在时返回400
    }

    if (supplier_name) {
        const validSupplierResult = await SuppliersTask.getSupplierDetails(supplier_name);
        if (!validSupplierResult) {
            return throwError(next, "供应商不存在!");
        }
    }
    // 当提交的供应商不存在时返回400

    if (barcode) {
        const validNewBarcodeResult = await CommodityTask.getCommodityDetails(barcode);
        if (validNewBarcodeResult) {
            return throwError(next, "新条码已存在!");
        }
    }
    const id = await CommodityTask.updateCommodityValue({
        current_barcode,
        barcode,
        name,
        category_name,
        unit,
        size,
        in_price,
        sale_price,
        vip_points,
        is_delete,
        supplier_name
    });

    const commodity_value = await CommodityTask.getCommodityDetails(id, "id");
    commodity_value["vip_points"] = commodity_value["vip_points"] === 1;


    res.json(commodity_value);
});

route.delete("/delete/:barcode", async (req, res, next) => {
    // 删除商品

    const { barcode } = req.params;

    const validBarcodeResult = await CommodityTask.getCommodityDetails(barcode);
    if (!validBarcodeResult) {
        return throwError(next, "此条码不存在!");
    }
    // 需要删除的商品条码不存在时返回400

    const { id } = validBarcodeResult;


    const validCommodityUseResult = await CommodityTask.checkCommodityUse(id);

    // 检查商品是否已经被出售过，出售过则无法被删除，只能禁用
    if (validCommodityUseResult) {
        return throwError(next, "商品已被出售过，无法删除!");
    }

    await CommodityTask.deleteCommodity(id);

    res.json({
        message: "删除成功!",
        barcode
    });

});


export default route;