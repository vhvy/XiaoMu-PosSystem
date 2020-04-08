import AppDAO from "../src/data/AppDAO.js";
import CommodityTasks from "../src/tasks/commodity.js";
import moment from "moment";
import { mathc } from "../src/lib/mathc.js";
import UserTasks from "../src/tasks/users.js";
import OrderTasks from "../src/tasks/frontend/orders.js";

function getRandomNum([min, max]) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const config = {
    start_time: moment("2017-11-01"),
    // 开始日期
    end_time_stamp: moment().endOf("day").subtract(3, "hour").format("x"),
    // 结束日期
    business_start: 8,
    // 开始营业时间
    business_stop: 21,
    // 结束营业时间
    commodity_count_range: [1, 5],
    // 订单内随机商品数量,
    order_interval_range: [15, 600]
};



function getRandomCommodity(list) {
    // 获取随机商品，返回订单所需信息

    const { commodity_count_range } = config;

    const len = list.length;

    const commodity_count = getRandomNum(commodity_count_range);
    // 随机商品数量

    let commodity_list = [];

    for (let i = 1; i <= commodity_count; i++) {
        const index = getRandomNum([0, len - 1]);
        // 随机商品数组下标

        commodity_list.push(list[index]);
    }

    let in_price = 0;
    let sale_price = 0;
    let sale_origin_price = 0;
    let profit = 0;
    let count = 0;
    let order_commodity = [];
    commodity_list
        .filter(i => i.is_delete === 0)
        .forEach(item => {
            count++;
            in_price = mathc.add(in_price, item.in_price);
            sale_price = mathc.add(sale_price, item.sale_price);
            sale_origin_price = sale_price;
            profit = mathc.add(
                profit,
                mathc.subtract(item.sale_price, item.in_price)
            );
            order_commodity.push({
                commodity_id: item.id,
                barcode: item.barcode,
                count: 1,
                origin_price: item.sale_price,
                sale_price: item.sale_price
            });
        });


    return {
        in_price,
        sale_price,
        sale_origin_price,
        profit,
        count,
        order_commodity
    };
}

function format(i) {
    return i >= 10 ? i : "0" + i;
}

let user_id = null;

function createToDayOrder(commodity_list, time_instance, list = []) {
    // 生成今天所有的订单
    const { order_interval_range, business_stop } = config;

    const hour = time_instance.get("hour");
    if (hour >= business_stop) {
        return list;
    }
    // 当前时间如果超出了营业截止时间，返回数据

    const year = time_instance.get("year");
    const month = time_instance.get("month") + 1;
    const day = time_instance.get("date");
    const timestamp = time_instance.format("x");

    const serial_number = (() => {
        let str = list.length + "";

        while (str.length < 4) {
            str = "0" + str;
        }

        return str;
    })();
    // 订单流水号

    const order_id = `${String(year).slice(2)}${format(month)}${format(day)}${String(timestamp).slice(5, 10)}${serial_number}`;
    // 订单号

    const values = getRandomCommodity(commodity_list);
    // 生成随机商品信息

    list.push({
        order_id,
        check_date: Number(time_instance.format("x")),
        client_pay: values["sale_origin_price"],
        user_id,
        ...values
    });
    // 生成订单信息

    const timeInterval = getRandomNum(order_interval_range) * 1000;
    // 订单时间随机间隔

    time_instance.add(timeInterval, "millisecond");
    // 订单随机间隔

    return createToDayOrder(commodity_list, time_instance, list);
    // 递归生成
}

async function insertOrderData(list) {

    const fields = [
        "order_id",
        "check_date",
        "sale_price",
        "sale_origin_price",
        "in_price",
        "profit",
        "client_pay",
        "user_id",
        "count"
    ];

    return await Promise.all(list.map(

        async ({ order_commodity, ...item }) => {
            const values = fields.map(key => item[key]);

            await AppDAO.run(`
        INSERT INTO orders 
        (${fields.join(", ")}) 
        VALUES (?${", ?".repeat(values.length - 1)})
        ;`, values);

            return await OrderTasks.saveOrderDetails(values[0], order_commodity);


        }
    )
    );
}

async function main() {

    const { start_time, end_time_stamp, business_start } = config;

    const commodity_pool = await CommodityTasks.getAllCommodityDetails(false);
    // 所有商品

    const users = await UserTasks.getAllUser();

    user_id = users[0].id;


    function check() {
        const start_time_stamp = start_time.format("x");

        return start_time_stamp < end_time_stamp;
    }

    while (check()) {

        start_time.startOf("day").add(business_start, "hour");
        // 获取今日开始营业的时间

        const values = createToDayOrder(commodity_pool, start_time);
        // 生成订单信息

        await insertOrderData(values);
        // 写入订单详情

        console.log("写入完成: ", start_time.format());
        start_time.add(1, "day");
    }

}

main();