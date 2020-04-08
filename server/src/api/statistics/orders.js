import express from "express";
import { ordersSchema, queryOrdersSchema } from "../../schema/statistics.js";
import { validBody } from "../../middleware/validBody.js";
import { StatisticsTasks } from "../../tasks/statistics.js";
import OrdersTask from "../../tasks/frontend/orders.js";
import { throwError } from "../../middleware/handleError.js";

const route = express.Router();

route.get("/", validBody(ordersSchema, "请检查时间范围!", false), async (req, res, next) => {
    // 根据时间范围查询销售数据

    const { start_time, end_time } = req.query;
    const result = await StatisticsTasks.queryOrdersByTime(start_time, end_time);
    res.json(result);
});

route.get("/query", validBody(queryOrdersSchema, "提供的数据不正确!", false), async (req, res, next) => {
    // 根据提供的数据查询相关订单和商品

    const query = req.query;
    const { status, message, data } = await StatisticsTasks.queryOrdersByKey(query);

    if (!status) return throwError(next, message);

    res.json(data);
})

route.get("/:order_id", async (req, res, next) => {
    // 根据订单编号查询商品数据

    const { order_id } = req.params;

    const orderDetails = await OrdersTask.queryOrderById(order_id);

    if (!orderDetails) {
        return throwError(next, "订单号不存在!");
    }

    const result = await StatisticsTasks.queryOrderCommodityById(order_id, orderDetails.check_date);

    res.json(result);
});

export default route;