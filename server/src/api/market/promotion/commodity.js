import express from "express";
import PromotionTask from "../../../tasks/market/promotion.js";
import CommodityTask from "../../../tasks/commodity.js";
import { throwError } from "../../../middleware/handleError.js";
import { validBody } from "../../../middleware/validBody.js";
import { addCommoditySchema, editCommoditySchema } from "../../../schema/promotion.js";

const route = express.Router();

route.get("/:query", async (req, res, next) => {
    // 获取某个促销活动的所有商品详情

    const { query } = req.params;

    const queryPromotionResult = await PromotionTask.getPromotion(query);
    if (!queryPromotionResult) {
        return throwError(next, "此活动不存在!");
    }

    const data = await PromotionTask.getPromotionCommodityDetailsByName(query);


    res.json(data);
});

route.post("/", validBody(
    addCommoditySchema,
    "请输入正确的促销活动详情!"
), async (req, res, next) => {
    // 向促销活动中增加商品

    const { promotion_name, commodity } = req.body;

    const queryPromotionResult = await PromotionTask.getPromotion(promotion_name);
    if (!queryPromotionResult) {
        return throwError(next, "此促销活动不存在!");
    }
    // 当促销活动不存在时返回400

    const { id } = queryPromotionResult;

    const { barcode,
        promotion_type,
        discount_value } = commodity;

    const {
        status,
        message,
        data,
        promoCommodityExist
    } = await PromotionTask.checkCommodity(id, barcode, promotion_type);

    if (!status) {
        return throwError(next, message);
    }
    // 检查参加促销的商品是否合法

    if (promoCommodityExist) {
        return throwError(next, "当前促销活动已包含此商品!");
    }

    const {
        commodity_id,
        promotion_type_id
    } = data;

    const result = await PromotionTask.addCommodityToPromotion(id, {
        commodity_id,
        promotion_type_id,
        discount_value
    });

    res.json(result);
});

route.delete("/", async (req, res, next) => {
    // 从促销活动中删除某个商品

    const { name, barcode } = req.query;

    if (!name || !barcode) {
        return throwError(next, "参数不正确!");
    }

    const queryPromotionResult = await PromotionTask.getPromotion(name);
    if (!queryPromotionResult) {
        return throwError(next, "此促销活动不存在!");
    }
    // 当促销活动不存在时返回400

    const commodityIsExist = await CommodityTask.getCommodityDetails(barcode);
    if (!commodityIsExist) {
        return throwError(next, "此条码商品不存在!");
    }
    // 当商品不存在时返回400

    const promoCommodityExist = await PromotionTask.checkPromoCommodityExist(
        queryPromotionResult.id,
        commodityIsExist.id
    );
    if (!promoCommodityExist) {
        return throwError(next, "此活动中没有此商品!");
    }
    // 当促销活动中不包含此商品时返回400

    const status = await PromotionTask.delCommodityFromPromo(
        queryPromotionResult.id,
        commodityIsExist.id
    );

    if (!status) {
        return throwError(next, "删除商品失败!");
    }

    res.send({
        message: "删除商品成功!"
    });
});

route.put("/", validBody(editCommoditySchema), async (req, res, next) => {

    const { promotion_name, barcode, update_value } = req.body;

    const queryPromotionResult = await PromotionTask.getPromotion(promotion_name);
    if (!queryPromotionResult) {
        return throwError(next, "此促销活动不存在!");
    }
    // 当促销活动不存在时返回400


    const { promotion_type, discount_value } = update_value;

    const {
        status,
        message,
        data,
        promoCommodityExist
    } = await PromotionTask.checkCommodity(queryPromotionResult.id, barcode, promotion_type);
    if (!status) {
        return throwError(next, message);
    }
    // 检查参加促销的商品是否合法

    if (!promoCommodityExist) {
        return throwError(next, "当前促销活动不包含此商品!");
    }

    const { commodity_id, promotion_type_id } = data;

    const result = await PromotionTask.updatePromoCommodity(
        queryPromotionResult.id,
        commodity_id,
        promotion_type_id,
        discount_value,
        promoCommodityExist.id
    );
    res.json(result);
});

export default route;