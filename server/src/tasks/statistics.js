// import AppDAO from "../data/AppDAO.js";
import UserTasks from "./users.js";
import OrdersTasks from "./frontend/orders.js";
import CommodityTask from "./commodity.js";
import CategoryTask from "./categories.js";
import SupplierTask from "./suppliers.js";
import { math } from "../lib/mathc.js";
import { getFormatTime, createTimerangeKey } from "../lib/time.js";

export class StatisticsTasks {

    static async queryOrdersByTime(start_time, end_time) {
        // 通过时间查询商品销售详情

        const user_list = await UserTasks.getAllUser();

        const order_list = await OrdersTasks.getOrdersByTimerange(start_time, end_time);

        return order_list.map(({ user_id, is_undo, ...fields }) => ({
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
                const commodity_list = await OrdersTasks.getOrderCommodityById(order_id, check_date, true);
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
                const commodity_list = await OrdersTasks.getOrderCommodityById(order_id, check_date);
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

        const orders = await OrdersTasks.getOrdersByTimerange(start_time, end_time);

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

    static async getPropotionByCategory(order_list, category) {
        // 查询商品销售分类比例

        if (!category || category === "") return;

        const categories = await CategoryTask.getCategoriesDetails();
        // 所有分类的信息

        if (category !== "all") {
            // 如果不是要查询所有分类，则需要验证分类是否存在

            const result = categories.find(i => i.name === category);
            if (!result) {
                // 不是合法分类

                return {
                    status: false,
                    message: "此分类不存在!"
                };
            }
        }

        const commodity_count_value = {};

        for (let { order_id } of order_list) {
            const order_commodity_list = await OrdersTasks.getOrderDetails(order_id);

            for (let { commodity_id, count, sale_price } of order_commodity_list) {

                const price = math.multiply(sale_price, count);
                // 订单中此商品总金额

                if (commodity_count_value[commodity_id]) {
                    commodity_count_value[commodity_id] = math.add(
                        commodity_count_value[commodity_id],
                        price
                    );
                } else {
                    commodity_count_value[commodity_id] = price;
                }
            }
        }

        const commodity_id_list = Object.keys(commodity_count_value);

        let category_count_list = {};

        for (let id of commodity_id_list) {
            const { category_id } = await CommodityTask.getCommodityDetails(id, "id", true);
            if (category_count_list[category_id]) {
                category_count_list[category_id] = math.add(
                    category_count_list[category_id],
                    commodity_count_value[id]
                );
            } else {
                category_count_list[category_id] = commodity_count_value[id];
            }
        }


        let category_id_list = [];


        if (category === "all") {
            // 所有分类

            category_id_list = Object.keys(category_count_list).map(i => Number(i));
        } else {
            // 选择某个含有子分类的父分类

            const current_category_value = categories.find(i => i.name === category);
            // 要查询的信息

            const { id, parent_id } = current_category_value;

            if (parent_id) {
                // 如果有父分类id存在，则为子分类
                // 直接返回单个子分类信息即可

                category_id_list.push(Number(id));
            } else {
                // 没有父分类id存在，则为父分类

                const child_category_list = categories.filter(i => i.parent_id === id);
                // 从属于此父分类的子分类

                if (child_category_list.length === 0) {
                    // 没有子分类，则直接返回父分类id

                    category_id_list.push(id);
                } else {
                    // 含有子分类，返回所有子分类id

                    category_id_list = child_category_list.map(i => i.id);
                }
            }

        }


        const result = category_id_list.map(id => {
            const { name } = categories.find(i => i.id === id);
            return {
                name,
                value: category_count_list[id]
            }
        });

        return result;

    }

    static async getPropotionByVip(order_list) {
        // 查询商品销售会员比例

        let vip_sum = 0;
        let no_vip_sum = 0;

        for (let { vip_code, sale_price } of order_list) {
            if (vip_code) {
                vip_sum = math.add(vip_sum, sale_price);
            } else {
                no_vip_sum = math.add(no_vip_sum, sale_price);
            }
        }

        return [
            {
                name: "会员订单金额",
                value: vip_sum
            },
            {
                name: "非会员订单金额",
                value: no_vip_sum
            }
        ];
    }

    static async getPropotionByPosUser(order_list) {
        // 查询商品销售收银员比例

        const users = await UserTasks.getAllUser();

        let user_check_count = {};

        for (let { user_id, sale_price } of order_list) {

            if (user_check_count[user_id]) {
                user_check_count[user_id] = math.add(user_check_count[user_id], sale_price);
            } else {
                user_check_count[user_id] = sale_price;
            }
        }

        return Object.keys(user_check_count).map(id => {
            const { username: name } = users.find(i => i.id === Number(id));
            return {
                name,
                value: user_check_count[id]
            };
        });
    }

    static async getPropotionByPayType(order_list) {
        // 查询商品销售支付方式比例

        let pay_type_count = {};

        for (let { pay_type, sale_price } of order_list) {

            if (pay_type_count[pay_type]) {
                pay_type_count[pay_type] = math.add(
                    pay_type_count[pay_type],
                    sale_price
                );
            } else {
                pay_type_count[pay_type] = sale_price;
            }
        }

        return Object.keys(pay_type_count).map(name => ({
            name,
            value: pay_type_count[name]
        }));
    }

    static async getPropotionBySupplier(order_list) {
        // 查询商品销售供应商比例

        const suppliers = await SupplierTask.getSupplierDetails();

        const commodity_count_value = {};

        for (let { order_id } of order_list) {
            const order_commodity_list = await OrdersTasks.getOrderDetails(order_id);

            for (let { commodity_id, count, sale_price } of order_commodity_list) {

                const price = math.multiply(count, sale_price);

                if (commodity_count_value[commodity_id]) {
                    commodity_count_value[commodity_id] = math.add(
                        commodity_count_value[commodity_id],
                        price
                    );
                } else {
                    commodity_count_value[commodity_id] = price;
                }
            }
        }

        const supplier_count_value = {};

        const commodity_id_list = Object.keys(commodity_count_value);

        for (let id of commodity_id_list) {
            const { supplier_id } = await CommodityTask.getCommodityDetails(Number(id), "id", true);

            const price = commodity_count_value[id];

            if (supplier_count_value[supplier_id]) {
                supplier_count_value[supplier_id] = math.add(
                    supplier_count_value[supplier_id],
                    price
                );
            } else {
                supplier_count_value[supplier_id] = price
            }
        }



        return Object.keys(supplier_count_value).map(id => ({
            name: suppliers.find(i => i.id === Number(id)).name,
            value: supplier_count_value[id]
        }));
    }

    static async getCommoditySalesProportionByTime(start_time, end_time, type) {
        // 查询指定时间范围内商品销售比例

        const order_list = await OrdersTasks.getOrdersByTimerange(start_time, end_time, true);
        // 有效订单列表

        if (order_list.length === 0) return {
            status: true,
            data: []
        };

        const config = [
            {
                type: "category",
                fn: this.getPropotionByCategory
            },
            {
                type: "vip",
                fn: this.getPropotionByVip
            },
            {
                type: "pos_user",
                fn: this.getPropotionByPosUser
            },
            {
                type: "pay_type",
                fn: this.getPropotionByPayType
            },
            {
                type: "supplier",
                fn: this.getPropotionBySupplier
            }
        ];

        const [baseType, childArgs] = type.split("$");
        // 前端传来的查询类型以及子参数
        // 子参数目前仅查询分类时使用

        const handleItem = config.find(i => i.type === baseType);

        if (!handleItem) {
            return {
                status: false,
                message: "此查询类型不存在!"
            }
        }

        const result = await handleItem.fn(order_list, childArgs);

        if (!result) {
            // 这里只有分类参数会发生错误


            return {
                status: false,
                message: "此分类不存在!"
            }
        }

        return {
            status: true,
            data: result
        };
    }

    static async getSalesTrends(query) {
        // 查询门店销售趋势
        const { start_time, end_time, type } = query;

        const config = [
            {
                type: "hour",
                maxTime: 24 * 60 * 60 * 1000
            },
            {
                type: "day",
                maxTime: 366 * 24 * 60 * 60 * 1000
            },
            {
                type: "month",
                maxTime: 12 * 31 * 24 * 60 * 60 * 1000
            }
        ];

        const handleItem = config.find(i => i.type === type);

        if (!handleItem) {
            return {
                status: false,
                message: `查询类型(${type})不存在`
            }
        }

        const { maxTime } = handleItem;

        const [_start_time, _end_time, timeKeyList] = createTimerangeKey(start_time, end_time, maxTime, type);

        const order_list = await OrdersTasks.getOrdersByTimerange(_start_time, _end_time, true);

        let result = {};

        for (let { check_date, ...args } of order_list) {
            const timeKey = getFormatTime(check_date, type);
            !result[timeKey] && (result[timeKey] = {});
            const keys = ["sale_price", "in_price", "profit", "count"];

            for (let key of keys) {
                let vl = result[timeKey];

                vl[key] = vl[key] === undefined ? args[key] : math.add(vl[key], args[key]);
            }
        }


        let data = [];

        for (let key of timeKeyList) {
            const value = result[key];
            data.push({
                time: key,
                ...value
            });
        }



        return {
            status: true,
            data
        };
    }
}