import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { proportionSchema } from "../../schema/statistics.js";
import { StatisticsTasks } from "../../tasks/statistics.js";
import { throwError } from "../../middleware/handleError.js";

const route = express.Router();

route.get("/", validBody(proportionSchema, "时间戳参数不正确!", false), async (req, res, next) => {
    // 查询指定时间范围内商品销售比例

    const { start_time, end_time, type } = req.query;

    const { status, data, message } = await StatisticsTasks.getCommoditySalesProportionByTime(start_time, end_time, type);

    if (!status) {
        return throwError(next, message);
    }

    res.json(data);
});

export default route;