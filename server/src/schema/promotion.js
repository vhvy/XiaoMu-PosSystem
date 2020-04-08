import Joi from "@hapi/joi";
import { barcode } from "./commodity.js";

export const name = Joi.string().min(1).max(20);
export const start_date = Joi.date().timestamp();
export const end_date = Joi.date().timestamp();
export const description = Joi.string().min(1).max(30);

export const createPromotionSchema = Joi.object({
    name: name.required(),
    start_date: start_date.required(),
    end_date: end_date.min(Joi.ref("start_date")).required(),
    description
});

export const updatePromotionSchema = Joi.object({
    name: name.required(),
    update_value: Joi.object({
        new_name: name,
        start_date: start_date,
        end_date: end_date,
        description
    }).or(
        "new_name",
        "start_date",
        "end_date",
        "description"
    ).required()
});

export const discount_value = Joi.number().min(0.0).max(100000).required();

export const commoditySchema = Joi.object({
    barcode: barcode.required(),
    promotion_type: name.required(),
    discount_value
});

export const addCommoditySchema = Joi.object({
    promotion_name: name.required(),
    commodity: commoditySchema.required()
    // commodity_list: Joi.array().min(1).max(200).items(commoditySchema).required()
});

export const editCommoditySchema = Joi.object({
    promotion_name: name.required(),
    barcode: barcode.required(),
    update_value: {
        promotion_type: name.required(),
        discount_value
    }
});