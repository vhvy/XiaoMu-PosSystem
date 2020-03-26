import AppDAO from "../data/AppDAO.js";
import OrderTasks from "./frontend/orders.js";
import { StatisticsTasks } from "./statistics.js";
import { getNightTimeStrap, getWeekendStartTimeStrap, getFormatTime, getNextDayStartTimeStrap } from "../lib/time.js";
import UserTasks from "./users.js";
import { math } from "../lib/mathc.js";

export class TodayTasks {

    static async getTodayOrderCount(start_time, end_time) {
        // 获取今日订单数量，以及会员订单数量

        const order_list = await OrderTasks.getOrdersByTimerange(start_time, end_time, true);

        const vip_order_count = order_list.filter(o => o.vip_code).length;

        return {
            order_count: order_list.length,
            vip_order_count
        };
    }

    static async getTodayData(isAdmin, username) {
        // 获取今日数据

        return isAdmin ?
            await this.getAdminTodayData(username) :
            await this.getCashierTodayData(username);
    }

    static async getAdminTodayData(username) {
        // 获取管理员今日数据

        const start_time = getNightTimeStrap();
        const end_time = new Date().getTime();

        const category_data = (await StatisticsTasks.getCommoditySalesProportionByTime(start_time, end_time, "category$all")).data;
        // 今天的商品销售分类占比数据


        const weekend_data = (await StatisticsTasks.getSalesTrends({
            start_time: getWeekendStartTimeStrap(end_time),
            end_time,
            type: "day"
        })).data;

        const todayData = weekend_data[weekend_data.length - 1];

        const { vip_order_count, order_count } = await this.getTodayOrderCount(start_time, end_time);

        return {
            category_data,
            // 分类数据

            weekend_data,
            // 周销售数据

            sale_price: todayData && todayData.sale_price || 0,
            // 今日销售额

            order_count,
            // 今日订单数

            count: todayData && todayData.count || 0,
            // 今日销售商品数量

            vip_order_count
            // 会员订单数量
        };
    }

    static async getCashierTodayData(username) {
        // 获取收银员今日数据

        const { id: user_id } = await UserTasks.getUserDetails(username);

        const end_time = new Date().getTime();
        const start_time = getNightTimeStrap(end_time);
        const weekend_start_time = getWeekendStartTimeStrap(end_time);

        const weekend_order = await OrderTasks.getOrdersByTimerangeAndUser(weekend_start_time, end_time, user_id, true);
        // 一周所有的有效订单

        let weekend_data_values = {};

        let time_stamp = weekend_start_time;

        for (let i = 0; i < 7; i++) {
            const day_key = getFormatTime(time_stamp, "day");

            weekend_data_values[day_key] = {
                sale_price: 0,
                count: 0
            };

            time_stamp = getNextDayStartTimeStrap(time_stamp);
        }


        for (let {
            sale_price,
            count,
            check_date
        } of weekend_order) {
            const day_key = getFormatTime(check_date, "day");

            !weekend_data_values[day_key] && (weekend_data_values[day_key] = {
                sale_price: 0,
                count: 0
            });

            weekend_data_values[day_key].sale_price = math.add(
                weekend_data_values[day_key].sale_price,
                sale_price
            );

            weekend_data_values[day_key].count = math.add(
                weekend_data_values[day_key].count,
                count
            );
        }

        let weekend_data = [];

        for (let key of Object.keys(weekend_data_values)) {
            const { sale_price, count } = weekend_data_values[key];
            weekend_data.push([
                key,
                sale_price,
                count
            ]);
        }

        // sale_price, order_count, count, vip_order_count,

        const todayOrderList = weekend_order.filter(o => o.check_date >= start_time);



        const [_d, sale_price, count] = weekend_data[weekend_data.length - 1];

        return {
            weekend_data,
            sale_price,
            count,
            order_count: todayOrderList.length,
            vip_order_count: todayOrderList.filter(o => o.vip_code).length
        };
    }
}

export default TodayTasks;