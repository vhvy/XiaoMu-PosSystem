import AppDAO from "../../data/AppDAO.js";
import PromotionTask from "../market/promotion.js";
import { mathc } from "../../lib/mathc.js";

class CommodityTask {

    static async getCommodityDetails(query, warequeryFlag = false) {
        // 根据查询条件返回商品详情

        const query_fields = ["barcode", "pinyin", "name"]
        // 分别从条码、拼音首字母缩写、名称来查询

        const front_field_list = ["id", "barcode", "name", "unit", "size", "sale_price", "vip_points", "is_delete"];
        // 前台进行销售时需要的字段

        const ware_field_list = ["id", "barcode", "category_id", "name", "in_price", "sale_price", "is_delete"];
        // 仓库进行查询时需要的字段


        const need_fields = (warequeryFlag ? ware_field_list : front_field_list).join(", ");

        const queryMethod = warequeryFlag ? "get" : "all";

        for (let key of query_fields) {
            const result = await AppDAO[queryMethod](`
            SELECT ${need_fields} FROM commodity 
            WHERE ${key}=?
            ;`, query);

            if (warequeryFlag && result) return [result];
            if (!warequeryFlag && result.length !== 0) return result;
            // 精准匹配

            const result_fuzzy = await AppDAO[queryMethod](`
            SELECT ${need_fields} FROM commodity 
            WHERE ${key} LIKE ?
            ;`, `%${query}%`);

            if (warequeryFlag && result_fuzzy) return [result_fuzzy];
            if (!warequeryFlag && result_fuzzy.length !== 0) return result_fuzzy;
            // 模糊匹配
        }

        return [];
    }



    static async parseCommodityList(list) {
        // 将商品属性转换为所需的格式

        const time = new Date().getTime();
        // 当前时间戳

        const promo_list = await PromotionTask.queryPromoByNowTime(time);
        // 当前之间内是否有促销活动


        if (!promo_list) {
            // 没有促销活动，直接进行属性map

            return list.map(({ sale_price, vip_points, is_delete, ...keys }) => {
                return {
                    ...keys,
                    vip_points: vip_points === 1,
                    is_delete: is_delete === 1,
                    status: "销售",
                    origin_price: sale_price,
                    sale_price
                }
            });
        } else {
            // 有促销活动，按照促销活动规则进行优惠

            const promo_type_list = await PromotionTask.getPromotionType();

            const promo_id_list = promo_list.map(({ id }) => id);

            const commodity_id_list = list.map(({ id }) => id);

            const promo_commodity_list = await PromotionTask.getCommodityByValidPromo(promo_id_list, commodity_id_list);
            // 参加活动的商品信息

            return list.map(({ id, barcode, sale_price, vip_points, is_delete, ...keys }) => {
                const values = promo_commodity_list.find(({ commodity_id }) => commodity_id === id);
                // 对应的促销信息

                if (!values) {
                    // 此商品没有促销信息时直接convert

                    return {
                        ...keys,
                        id,
                        barcode,
                        vip_points: vip_points === 1,
                        is_delete: is_delete === 1,
                        status: "销售",
                        origin_price: sale_price,
                        sale_price
                    };
                } else {
                    // 此商品拥有促销信息

                    const {
                        promotion_type_id,
                        discount_value
                    } = values;

                    const { name } = promo_type_list.find(i => i.id === promotion_type_id);

                    let price = 0;
                    // 促销活动之后的售价

                    switch (name) {
                        case "单品特价":
                            price = discount_value;
                            break;
                        case "单品打折":
                            price = mathc.multiply(sale_price, discount_value);
                            break;
                        default:
                            price = sale_price;
                            break;
                    }

                    return {
                        ...keys,
                        id,
                        barcode,
                        vip_points: vip_points === 1,
                        is_delete: is_delete === 1,
                        status: "促销",
                        origin_price: sale_price,
                        sale_price: price
                    };
                }

            });

            // return await Promise.all(list.map(async ({ id, barcode, sale_price, vip_points, is_delete, ...keys }) => {

            //     const result = await PromotionTask.getCommodityByValidPromo(time, id);

            //     if (!result) {
            //         return {
            //             ...keys,
            //             id,
            //             barcode,
            //             vip_points: vip_points === 1,
            //             is_delete: is_delete === 1,
            //             status: "销售",
            //             origin_price: sale_price,
            //             sale_price
            //         }
            //     }
            //     const { promotion_type_id, ...args } = result;
            //     const { key } = await PromotionTask.getPromotionType(promotion_type_id);
            //     const value = args[key];
            //     let price = 0;

            //     switch (key) {
            //         case "single_discount":
            //             price = sale_price * value;
            //             break;
            //         case "single_off_price":
            //             price = value;
            //             break;
            //         default:
            //             price = sale_price;
            //             break;
            //     }

            //     return {
            //         ...keys,
            //         id,
            //         barcode,
            //         vip_points: vip_points === 1,
            //         is_delete: is_delete === 1,
            //         status: "促销",
            //         promotion_type: key,
            //         origin_price: sale_price,
            //         sale_price: price
            //     }
            // }));
        }
    }
}

export default CommodityTask;