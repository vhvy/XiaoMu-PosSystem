import AppDAO from "../../data/AppDAO.js";
import CommodityTask from "../commodity.js";

class PromotionTask {

    static async queryPromoByNowTime(nowTime) {
        // 检查提供的时间内是否有促销活动

        return await AppDAO.all(`
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


    static async getPromotionCommodityDetailsByName(query) {
        // 使用促销活动名称获取参加所有促销活动的商品详情

        const list = await AppDAO.all(`
        SELECT * FROM promotion_details 
        WHERE promotion_id=(
            SELECT id FROM promotion WHERE name=?
        )
        ;`, query);

        if (list.length === 0) return list;

        return await this.mapPromoCommodityDetails(list);
    }

    static async mapPromoCommodityDetails(data) {
        // 将促销活动中商品详细信息map为前端需要的信息

        const promotion_type_map = await this.getPromotionType();
        async function queryFn(
            {
                id,
                commodity_id,
                promotion_type_id,
                discount_value,
                ...field
            }
        ) {
            const { name, barcode, in_price, sale_price } = await CommodityTask.getCommodityDetails(commodity_id, "id");
            const promotion_type_name = promotion_type_map.find(i => i.id === promotion_type_id).name;

            return {
                id,
                barcode,
                name,
                in_price,
                sale_price,
                promotion_type_name,
                discount_value
            };
        }

        if (Array.isArray(data)) {
            // 如果传入参数是数组，则进行map映射

            return await Promise.all(data.map(item => queryFn(item)));
        }


        return await queryFn(data);
        // 否则就直接进行映射
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

    static async checkPromoType(name) {
        // 检查促销类型是否合法

        return await AppDAO.get(`
        SELECT * FROM promotion_type 
        WHERE name = ?
        ;`, name);
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

    static async deletePromotion(id) {
        // 删除指定ID的促销活动

        await this.clearPromotion(id);

        return await AppDAO.run(`
        DELETE FROM promotion 
        WHERE id=?
        ;`, id);
    }

    static async checkCommodity(promotion_id, barcode, promotion_type) {
        // 验证参加促销活动的商品是否合法

        const commodityDetails = await CommodityTask.getCommodityDetails(barcode);
        //  获取商品信息

        if (!commodityDetails) {
            // 商品不存在 
            return {
                status: false,
                message: `条码为${barcode}的商品不存在!`
            }
        }
        // 商品不存在直接返回错误🙅

        const promoTypeDetails = await this.checkPromoType(promotion_type);

        if (!promoTypeDetails) {
            // 商品促销类型不存在
            return {
                status: false,
                message: `促销类型'${promotion_type}'不存在!`
            }
        }

        const commodity_id = commodityDetails.id;

        const promoCommodityExist = await this.checkPromoCommodityExist(promotion_id, commodity_id);

        return {
            status: true,
            promoCommodityExist,
            data: {
                commodity_id,
                promotion_type_id: promoTypeDetails.id
            }
        };
    }


    static async addCommodityToPromotion(promotion_id, data) {
        // 添加新的商品到促销活动中
        const { commodity_id, promotion_type_id, discount_value } = data;

        const { lastID: id } = await AppDAO.run(`
            INSERT INTO promotion_details 
            (promotion_id, commodity_id, promotion_type_id, discount_value) 
            VALUES (?, ?, ?, ?)
            ;`, [
            promotion_id,
            commodity_id,
            promotion_type_id,
            discount_value
        ]);
        // 添加商品到促销活动中

        return await this.mapPromoCommodityDetails({
            id,
            commodity_id,
            promotion_type_id,
            discount_value
        });

    }

    static async getPromotionCommodityById(id) {
        // 从参加促销活动的商品数据id查询商品促销数据

        return await AppDAO.get(`
        SELECT * FROM promotion_details 
        WHERE id = ?
        ;`, id);
    }

    static async getCommodityByValidPromo(promo_id_list, commodity_id_list) {
        // 从有效活动中查找促销商品
        
        return await AppDAO.all(`
        SELECT * FROM promotion_details 
        WHERE (
            commodity_id IN (${commodity_id_list.join(", ")}) 
            AND 
            promotion_id IN (${promo_id_list.join(", ")})
        )
        ;`);
    }

    static async delCommodityFromPromo(promotion_id, commodity_id) {
        const { changes } = await AppDAO.run(`
        DELETE FROM promotion_details 
        WHERE (promotion_id = ? AND commodity_id = ?)
        ;`, [promotion_id, commodity_id]);
        return changes === 1;
    }

    static async checkPromoCommodityExist(promotion_id, commodity_id) {
        // 检查促销活动是否含有某商品

        return await AppDAO.get(`
        SELECT id FROM promotion_details 
        WHERE (promotion_id = ? AND commodity_id = ?)
        ;`, [promotion_id, commodity_id]);
    }

    static async updatePromoCommodity(promotion_id, commodity_id, promotion_type_id, discount_value, id) {
        // 更新促销活动中某商品信息

        const result = await AppDAO.run(`
        UPDATE promotion_details 
        SET promotion_type_id=?, discount_value=? 
        WHERE (
            promotion_id=? 
            AND 
            commodity_id=?
        )
        `, [
            promotion_type_id,
            discount_value,
            promotion_id,
            commodity_id
        ]);

        const base = await this.mapPromoCommodityDetails({
            id,
            commodity_id,
            promotion_type_id,
            discount_value
        });

        return base;
    }
}

export default PromotionTask;