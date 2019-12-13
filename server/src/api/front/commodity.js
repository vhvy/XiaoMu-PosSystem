import express from "express";
import { throwError } from "../../middleware/handleError.js";
import CommodityTask from "../../tasks/frontend/commodity.js";

const route = express.Router();

route.get("/:query", async (req, res, next) => {
    // 根据输入的条码/名称/拼音缩写查询商品

    const { query } = req.params;

    const list = await CommodityTask.getCommodityDetails(query.toUpperCase());

    let data = [];
    if (list.length !== 0) {
        data = await CommodityTask.parseCommodityList(list);
    }

    res.json(data);
})

export default route;