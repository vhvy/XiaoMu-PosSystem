import express from "express";
import PromotionTask from "../../tasks/market/promotion.js";
import { validBody } from "../../middleware/validBody.js";
import { createPromotionSchema, updatePromotionSchema, updatePromotionDetailsSchema, deletePromotionSchema } from "../../schema/promotion.js";
import { throwError } from "../../middleware/handleError.js";
import CommodityTask from "../../tasks/commodity.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取所有促销活动

    const result = await PromotionTask.getPromotion()

    res.json(result);
});

route.get("/type", async (req, res) => {
    // 获取所有促销类型

    const result = await PromotionTask.getPromotionType();
    res.json(result);
});

route.post("/create", validBody(
    createPromotionSchema,
    "请输入正确的促销活动详情!"
), async (req, res, next) => {
    // 创建促销活动

    const { name, start_date, end_date, description } = req.body;
    if (end_date <= start_date) {
        return throwError(next, "活动结束时间必须迟于开始时间!");
    }
    // 当结束时间早于开始时间时返回400

    const queryNameResult = await PromotionTask.getPromotion(name);
    if (queryNameResult) {
        return throwError(next, "此活动名称已存在!");
    }
    // 当活动名称已存在时返回400

    await PromotionTask.createPromotion(name, start_date, end_date, description);

    res.json({
        name, start_date, end_date, description
    });
});

route.put("/update", validBody(
    updatePromotionSchema,
    "请输入正确的促销活动信息!"
), async (req, res, next) => {
    // 修改促销活动信息，名称、简介、开始结束时间等

    const { name, update_value } = req.body;

    const queryNameResult = await PromotionTask.getPromotion(name);
    if (!queryNameResult) {
        return throwError(next, "此活动不存在!");
    }
    // 当活动名称不存在时返回400

    const { new_name, start_date, end_date, description } = update_value;

    if (new_name) {
        const queryNewNameResult = await PromotionTask.getPromotion(new_name);
        if (queryNewNameResult) {
            return throwError(next, "新的活动名称已存在!");
        }
    }
    // 当新的活动名称已存在时返回400

    if (start_date && end_date && start_date >= end_date) {
        return throwError(next, "活动结束时间必须迟于开始时间!");
    }
    // 当同时更新了开始时间和结束时间且活动结束时间等于/小于开始时间时返回400；

    if (start_date && !end_date && start_date >= queryNameResult.end_date) {
        return throwError(next, "新的活动开始时间必须早于当前的活动结束时间!")
    }
    // 在更新开始时间不更新结束时间的情况下，开始时间大于等于当前促销活动结束时间时返回400

    if (end_date && !start_date && end_date <= queryNameResult.start_date) {
        return throwError(next, "新的活动结束时间必须早于当前的活动开始时间!")
    }
    // 在更新结束时间不更新开始时间的情况下，结束时间大于等于当前促销活动开始时间时返回400

    await PromotionTask.updatePromotion({
        current_name: name, name: new_name, start_date, end_date, description
    });

    await PromotionTask.updatePromotionCommodity(queryNameResult.id, start_date, end_date);

    res.json({
        message: "更新成功!"
    });
});

route.delete("/delete", validBody(
    deletePromotionSchema,
    "请输入正确的促销活动名称!"
), async (req, res, next) => {
    // 删除促销活动

    const { name } = req.body;
    const queryPromotionResult = await PromotionTask.getPromotion(name);
    if (!queryPromotionResult) {
        return throwError(next, "此活动不存在!");
    }
    // 当促销活动不存在时返回400

    await PromotionTask.deletePromotion(queryPromotionResult.id);

    res.json({
        message: "删除成功!"
    });
});

route.post("/details", validBody(
    updatePromotionDetailsSchema,
    "请输入正确的促销活动详情!"
), async (req, res, next) => {
    // 设置参加促销活动的商品详情

    const { promotion_name, commodity_list } = req.body;

    const queryPromotionResult = await PromotionTask.getPromotion(promotion_name);
    if (!queryPromotionResult) {
        return throwError(next, "此促销活动不存在!");
    }
    // 当促销活动不存在时返回400

    const { id, start_date, end_date } = queryPromotionResult;
    const { status, data } = await PromotionTask.validCommodityList(id, commodity_list);
    if (!status) {
        return throwError(next, data);
    }
    // 检查参加促销的商品是否合法

    await PromotionTask.updatePromotionDetails(id, start_date, end_date, data);

    res.json({
        message: "促销活动商品更新完成!"
    });
});


route.get("/details/:query", async (req, res, next) => {
    // 获取促销活动详情

    const { query } = req.params;

    const queryPromotionResult = await PromotionTask.getPromotion(query);
    if (!queryPromotionResult) {
        return throwError(next, "此活动不存在!");
    }

    let data = [];
    const list = await PromotionTask.getPromotionDetails(query);
    const { name: promotion_name } = queryPromotionResult;
    const CommodityManage = new CommodityTask();

    if (list.length !== 0) {
        const promotion_type_key = await PromotionTask.getPromotionKey(true);
        data = await Promise.all(
            list.map(
                async ({ id, commodity_id, promotion_type_id, ...args }) => {
                    const { name: commodity_name, barcode } = await CommodityManage.getCommodityDetails(commodity_id, "id");
                    const { key, name: promotion_type_name } = promotion_type_key[promotion_type_id];

                    return {
                        id,
                        barcode,
                        commodity_name,
                        promotion_type_name,
                        [key]: args[key]
                    }
                }
            )
        );
    }
    res.json({
        promotion_name,
        data
    });
});

export default route;