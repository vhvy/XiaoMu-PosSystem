export class StatisticsTasks {
    static getOrderList(ajax, timerange) {
        // 使用时间范围获取订单详情

        const [start_time, end_time] = timerange;
        return ajax.get("/api/statistics/orders", {
            start_time,
            end_time
        });
    }

    static getOrderDetails(ajax, orderid) {
        // 使用订单号查询订单详情

        return ajax.get(`/api/statistics/orders/${encodeURIComponent(orderid)}`);
    }

    static queryOrderDetailsByKey(ajax, params) {
        // 使用提供的数据查询相关订单

        return ajax.get("/api/statistics/orders/query", params);
    }
}