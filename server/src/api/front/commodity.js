import express from "express";
import { throwError } from "../../middleware/handleError.js";
import CommodityTask from "../../tasks/frontend/commodity.js";

const route = express.Router();

route.get("/:query", async (req, res, next) => {

    const { warequery } = req.query;
    const isWareQueryFlag = warequery && warequery === "true";
    // 是否仓库管理界面查询的flag

    const { query } = req.params;

    const list = await CommodityTask.getCommodityDetails(query.toUpperCase(), isWareQueryFlag);
    // 查询结果

    if (isWareQueryFlag) {
        // 如果是仓库管理界面查询，就直接返回列表，无需进行解析

        return res.json(list);
    }


    let data = [];
    if (list.length !== 0) {
        data = await CommodityTask.parseCommodityList(list);
    }

    res.json(data);
})

export default route;