import VipTasks from "../tasks/vip.js";
import CommodityTasks from "../tasks/commodity.js"
import CategoryTasks from "../tasks/categories.js";
import SupplierTasks from "../tasks/suppliers.js";
import OrderTasks from "../tasks/frontend/orders.js";
import UsersTasks from "../tasks/users.js";
import { getFormatTime } from "../lib/time.js";

function createDataSource(list, config) {

    let data = [];

    for (let item of list) {
        let value = {};

        for (let { title, key, fn } of config) {
            const v = item[key];
            value[title] = fn && fn(v) || v;
        }

        data.push(value);
    }

    return data;
}

export class ExportDataTasks {

    static async exportCommodityData() {
        // 导出商品信息

        const category_list = await CategoryTasks.getCategoriesDetails();
        // 所有商品分类列表

        const supplier_list = await SupplierTasks.getSupplierDetails();
        // 所有供应商列表

        const commodity_list = await CommodityTasks.getAllCommodityDetails(false);
        // 所有商品列表

        const config = [
            {
                title: "条码",
                key: "barcode"
            },
            {
                title: "名称",
                key: "name"
            },
            {
                title: "分类",
                key: "category_id",
                fn: id => category_list.find(i => i.id === id).name
            },
            {
                title: "单位",
                key: "unit"
            },
            {
                title: "规格",
                key: "size"
            },
            {
                title: "是否积分",
                key: "vip_points",
                fn: v => v === 1 ? "是" : "否"
            },
            {
                title: "进价",
                key: "in_price"
            },
            {
                title: "售价",
                key: "sale_price"
            },
            {
                title: "库存数量",
                key: "count"
            },
            {
                title: "建立时间",
                key: "work_date",
                fn: t => getFormatTime(t)
            },
            {
                title: "修改时间",
                key: "change_date",
                fn: t => getFormatTime(t)
            },
            {
                title: "是否下架",
                key: "is_delete",
                fn: v => v === 1 ? "是" : "否"
            },
            {
                title: "供应商",
                key: "supplier_id",
                fn: id => supplier_list.find(i => i.id === id).name
            }
        ];

        return [
            {
                name: "商品数据",
                data: createDataSource(commodity_list, config)
            }
        ];
    }

    static async exportVipData() {
        //导出会员数据

        const vip_info_list = await VipTasks.getVipDetails();
        // 会员详细信息

        const config = [
            {
                title: "会员卡类型",
                key: "vip_type",
            },
            {
                title: "会员卡号",
                key: "code",
            },
            {
                title: "姓名",
                key: "name"
            },
            {
                title: "性别",
                key: "sex"
            },
            {
                title: "手机号",
                key: "phone"
            },
            {
                title: "状态",
                key: "work_type",
            },
            {
                title: "是否禁用",
                key: "is_disable",
                fn: v => v ? "是" : "否"
            },
            {
                title: "办理时间",
                key: "create_date",
                fn: v => getFormatTime(v)
            },
            {
                title: "修改时间",
                key: "change_date",
                fn: v => getFormatTime(v)
            }
        ];

        return [
            {
                name: "会员数据",
                data: createDataSource(vip_info_list, config)
            }
        ];
    }

    static async getOrderData() {
        // 获取所有订单数据

        const users_list = await UsersTasks.getAllUser();

        const order_list = await OrderTasks.getAllOrder();

        const config = [
            {
                title: "订单号",
                key: "order_id",
            },
            {
                title: "结账时间",
                key: "check_date",
                fn: time => getFormatTime(time)
            },
            {
                title: "商品数量",
                key: "count"
            },
            {
                title: "支付方式",
                key: "pay_type"
            },
            {
                title: "订单原金额",
                key: "sale_origin_price"
            },
            {
                title: "订单金额",
                key: "sale_price",
            },
            {
                title: "订单进价",
                key: "in_price"
            },
            {
                title: "订单利润",
                key: "profit",
            },
            {
                title: "会员卡号",
                key: "vip_code"
            },
            {
                title: "用户付款金额",
                key: "client_pay"
            },
            {
                title: "找零金额",
                key: "change"
            },
            {
                title: "收银员",
                key: "user_id",
                fn: id => users_list.find(i => i.id === id).username
            },
            {
                title: "订单状态",
                key: "is_undo",
                fn: v => v === 0 ? "正常" : "撤销"
            }
        ];

        return {
            name: "订单数据",
            data: createDataSource(order_list, config)
        };
    }

    static async getOrderCommodityData() {
        // 获取所有订单商品数据

        const order_commodity_list = await OrderTasks.getAllOrderCommodity();

        const config = [
            {
                title: "订单号",
                key: "order_id",
            },
            {
                title: "商品条码",
                key: "barcode",
            },
            {
                title: "销售类型",
                key: "status"
            },
            {
                title: "商品数量",
                key: "count"
            },
            {
                title: "原价",
                key: "origin_price"
            },
            {
                title: "售价",
                key: "sale_price"
            }
        ];

        return {
            name: "订单商品数据",
            data: createDataSource(order_commodity_list, config)
        };
    }

    static async exportSalasData() {
        // 导出销售数据
        const orderList = await this.getOrderData();
        const orderCommodityList = await this.getOrderCommodityData();

        return [orderList, orderCommodityList];

    }

    static async exportData(type) {
        // 导出数据

        const config = [
            {
                type: "commodity",
                fn: this.exportCommodityData.bind(this)
            },
            {
                type: "vip",
                fn: this.exportVipData.bind(this)
            },
            {
                type: "sales",
                fn: this.exportSalasData.bind(this)
            }
        ];

        const { fn } = config.find(i => i.type === type);

        return await fn();

    }
}

export default ExportDataTasks;