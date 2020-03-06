import AppDAO from "../data/AppDAO.js";
import UserTasks from "./users.js";
import OrdersTasks from "./frontend/orders.js";
import CommodityTask from "./commodity.js";
import OrdersTask from "./frontend/orders.js";

export class StatisticsTasks {
    static async queryOrdersByTime(start_time, end_time) {
        // 通过时间查询商品销售详情

        const user_list = await UserTasks.getAllUser();

        const sales = await OrdersTask.getOrdersByTimerange(start_time, end_time);

        return sales.map(({ user_id, is_undo, ...fields }) => ({
            ...fields,
            username: user_list.find(i => i.id === user_id).username,
            is_undo: is_undo === 1
        }));
    }

    static async queryOrderCommodityById(order_id, timestamp) {
        // 根据订单编号查询订单商品

        const commodity_list = await OrdersTasks.getOrderDetails(order_id);

        const result = Promise.all(commodity_list.map(
            async ({ order_id, commodity_id, ...fields }) => {
                const {
                    barcode, name, unit, size, in_price, pinyin
                } = await CommodityTask.getCommodityDetailsByTimestamp(timestamp, commodity_id, "id");

                return {
                    barcode,
                    name,
                    unit,
                    size,
                    in_price,
                    pinyin,
                    ...fields
                };
            }
        ));

        return result;
    }

    static async queryOrdersByKey(values) {
        // 按照提供的数据查询订单和商品信息
        // name barcode vip_code
        const { start_time, end_time, query: _query, type } = values;

        const query = _query.toUpperCase();

        async function queryByName(orders) {
            let data = [];
            for (let { id, order_id, check_date } of orders) {
                const commodity_list = await OrdersTask.getOrderCommodityById(order_id, check_date, true);
                for (let { name, pinyin, id: commodity_id } of commodity_list) {
                    (pinyin.includes(query) || name.includes(query)) && data.push({
                        id,
                        order_id,
                        commodity_id
                    });
                }
            }
            return data;
        }

        async function queryByBarcode(orders) {
            let data = [];
            for (let { id, order_id, check_date } of orders) {
                const commodity_list = await OrdersTask.getOrderCommodityById(order_id, check_date);
                for (let { barcode, id: selectId } of commodity_list) {
                    barcode.includes(query) && data.push({
                        id,
                        order_id,
                        selectId
                    });
                }
            }

            return data;
        }

        const config = [
            {
                type: "name",
                fn: queryByName
            },
            {
                type: "barcode",
                fn: queryByBarcode
            }
        ];

        const itemConfig = config.find(i => i.type === type);

        if (!itemConfig) return {
            status: false,
            message: "搜索类型不正确!"
        };

        const orders = await OrdersTask.getOrdersByTimerange(start_time, end_time);

        if (orders.length === 0) return {
            status: true,
            data: []
        };

        const { fn } = itemConfig;

        const data = await fn(orders);

        return {
            status: true,
            data
        };
    }
}