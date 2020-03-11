import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { throwError } from "../../middleware/handleError.js";
import { salesTrendsSchema } from "../../schema/statistics.js";
import { StatisticsTasks } from "../../tasks/statistics.js";

const route = express.Router();

route.get("/", validBody(salesTrendsSchema, "参数不正确!", false), async (req, res, next) => {
    // 查询商品销售趋势

    const { query } = req;

    const { status, data, message } = await StatisticsTasks.getSalesTrends(query);

    if (!status) {
        return throwError(next, message);
    }

    res.send(data);
});

export default route;