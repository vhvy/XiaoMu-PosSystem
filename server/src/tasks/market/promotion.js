import AppDAO from "../../data/AppDAO.js";
import CommodityTask from "../commodity.js";

class PromotionTask {

    static async checkHasPromotion(nowTime) {
        // 检查提供的时间内是否有促销活动

        return await AppDAO.get(`
        SELECT id FROM promotion 
        WHERE (start_date < ? AND end_date > ?)
        ;`, [nowTime, nowTime]);
    }

    static async getPromotion(args) {
        // 获取所有促销活动

        if (!args) {
            return await AppDAO.all(`
            SELECT * FROM promotion
            ;`);
        }
        const query = (typeof args === "number") ? "id" : "name";
        return await AppDAO.get(`
        SELECT * FROM promotion WHERE ${query}=?
        ;`, args);
    }


    static async getPromotionDetails(query) {
        // 获取促销活动详情

        return await AppDAO.all(`
        SELECT * FROM promotion_details 
        WHERE promotion_id=(
            SELECT id FROM promotion WHERE name=?
        )
        ;`, query);
    }

    static async getPromotionType(args) {
        // 获取所有促销类型
        if (!args) {
            return await AppDAO.all(`
        SELECT * FROM promotion_type
        ;`);
        }

        const query = (typeof args === "number") ? "id" : "name";
        return await AppDAO.get(`
        SELECT * FROM promotion_type 
        WHERE ${query}=?
        ;`, args);
    }

    static async createPromotion(name, start_date, end_date, description) {
        // 创建新的促销活动
        let fields = "";
        const args = [name, start_date, end_date];
        if (description) {
            fields = ", description";
            args.push(description);
        }

        return await AppDAO.run(`
        INSERT INTO promotion 
        (name, start_date, end_date${fields}) 
        VALUES (?${", ?".repeat(args.length - 1)})
        ;`, args);
    }

    static async updatePromotion({ current_name, ...params }) {
        // 更新促销活动信息，名称、简介、开始结束时间等

        const fields = [];
        const args = [];

        const keys = Object.keys(params);
        for (let key of keys) {
            const vl = params[key];
            if (vl !== undefined) {
                fields.push(key);
                args.push(vl);
            }
        }
        args.push(current_name);

        const query = fields.map(f => `${f}=?`).join(", ");

        return await AppDAO.run(`
        UPDATE promotion 
        SET ${query} 
        WHERE name=?
        ;`, args);
    }

    static async updatePromotionCommodity(id, start_date, end_date) {
        return await AppDAO.run(`
        UPDATE promotion_details 
        SET start_date=?, end_date=? 
        WHERE promotion_id=?
        ;`, [start_date, end_date, id]);
    }

    static async deletePromotion(id) {
        // 删除指定ID的促销活动

        await this.clearPromotion(id);

        return await AppDAO.run(`
        DELETE FROM promotion 
        WHERE id=?
        ;`, id);
    }

    static async getPromotionKey(id = false) {
        if (id) {
            const promotion_type_key = {};
            (await this.getPromotionType()).map(({ id, key, name }) => {
                promotion_type_key[id] = {
                    name,
                    key
                };
            });
            return promotion_type_key;
        } else {

            const promotion_type_key = {};
            (await this.getPromotionType()).map(({ name, key }) => {
                promotion_type_key[name] = key;
            });

            return promotion_type_key;
        }
    }

    static async validCommodityList(id, list) {
        // 验证参加促销活动的商品是否合法

        const promotion_type_key = await this.getPromotionKey();

        let result = [];
        let barcode_list = [];
        for (let i of list) {

            const { barcode, promotion_type } = i;

            if (barcode_list.includes(barcode)) {
                return {
                    status: false,
                    data: `同一个活动中单个商品只能参加一次!条码${barcode}`
                }
            }

            const commodity = await CommodityTask.getCommodityDetails(barcode);
            if (!commodity) {
                return {
                    status: false,
                    data: `条码为${barcode}的商品不存在!`
                }
            } // 商品不存在直接返回错误🙅

            const queryPromotionTypeResult = await this.getPromotionType(promotion_type);
            if (!queryPromotionTypeResult) {
                return {
                    status: false,
                    data: `促销类型'${promotion_type}'不存在!`
                }
            }

            const field = promotion_type_key[promotion_type];
            if (i[field] === undefined) {
                return {
                    status: false,
                    data: `请为${promotion_type}输入正确的对应值!`
                }
            }

            result.push({
                commodity_id: commodity["id"],
                promotion_type_id: queryPromotionTypeResult["id"],
                value: i[field],
                field
            });
            barcode_list.push(barcode);
        }

        return {
            status: true,
            data: result
        };
    }

    static async clearPromotion(id) {
        // 清空指定活动下的所有商品

        return await AppDAO.run(`
        DELETE FROM promotion_details 
        WHERE promotion_id=?
        ;`, id);
    }

    static async updatePromotionDetails(promotion_id, start_date, end_date, list) {
        // 设置参加促销活动的商品信息

        await this.clearPromotion(promotion_id);

        return await Promise.all(list.map(async item => {
            const { commodity_id, promotion_type_id, field, value } = item;

            return await AppDAO.run(`
            INSERT INTO promotion_details 
            (promotion_id, commodity_id, promotion_type_id, start_date, end_date, ${field}) 
            VALUES (?, ?, ?, ?, ?, ?)
            ;`, [
                promotion_id,
                commodity_id,
                promotion_type_id,
                start_date,
                end_date,
                value
            ]);
        }));
    }

    static async getPromotionCommodity(time, commodity_id) {
        // 获取某个时间段内参加活动的商品信息

        const result = await AppDAO.all(`
        SELECT start_date, promotion_type_id, single_off_price, single_discount, fill_off_price, fill_discount 
        FROM promotion_details 
        WHERE (commodity_id = ? AND start_date < ? AND end_date > ?)
        ;`, [commodity_id, time, time]);

        if (result.length === 0) return undefined;
        result.sort(({ start_date }, { start_date: start_date2 }) => start_date - start_date2);

        return result[0];
    }
}

export default PromotionTask;