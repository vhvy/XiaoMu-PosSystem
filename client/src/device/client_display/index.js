export { ClientDisplayConfig } from "./config";

export class ClientDisplay {

    static async show({
        all_price = 0,
        // 应付金额

        pay_price = 0,
        // 付款金额

        change = 0
        // 找零金额
    }) {
        // 设置客显显示内容

        console.log(`[设备]客显: 当前应付金额${all_price}, 付款金额${pay_price}, 找零金额${change}`);
    }

    static async reset() {
        // 清空客显当前结果
    }
}