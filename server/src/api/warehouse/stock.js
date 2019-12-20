import express from "express";
import StockTask from "../../tasks/warehouse/stock.js";
import { throwError } from "../../middleware/handleError.js";
import { validBody } from "../../middleware/validBody.js";
import { createStockSchema } from "../../schema/stock.js";
import SuppliersTask from "../../tasks/suppliers.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取所有进货记录

    const list = await StockTask.getStock();
    const data = await Promise.all(list.map(async ({ id, supplier_id, date, description }) => {
        const { name: supplier_name } = await SuppliersTask.getSupplierDetails(supplier_id);
        return {
            id,
            supplier_name,
            date,
            description
        }
    }));

    res.json(data);
});

route.get("/:query", async (req, res, next) => {
    // 获取某个进货单的详细信息

    const { query } = req.params;
    const checkStockResult = await StockTask.getStock(query);
    if (!checkStockResult) {
        return throwError(next, `订货单${query}不存在!`);
    }
    // 订货单不存在时返回400

    const result = await StockTask.getStockDetails(checkStockResult.id);
    const data = await StockTask.mapStockDetailsIDToText(result);
    res.json(data);
});

route.post("/create", validBody(
    createStockSchema,
    "请提交正确的进货单信息!"
), async (req, res, next) => {
    // 创建进货单

    const { supplier_name, description, commodity_list } = req.body;
    const querySupplierResult = await SuppliersTask.getSupplierDetails(supplier_name);
    if (!querySupplierResult) {
        return throwError(next, "此供应商不存在!");
    }
    // 当供应商不存在时返回400

    const { status, data } = await StockTask.checkCommodityList(commodity_list);
    if (!status) {
        return throwError(next, data);
    }
    // 当有不存在的商品时返回400

    const id = await StockTask.createStock(querySupplierResult.id, data, description);

    const { date } = await StockTask.getStock(id, "id");

    res.json({
        date,
        supplier_name,
        description
    });
});

export default route;