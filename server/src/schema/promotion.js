import Joi from "@hapi/joi";
import { barcode, in_price as price } from "./commodity.js";

export const name = Joi.string().min(1).max(20);
export const start_date = Joi.date().timestamp().min(1576033133614);
export const end_date = Joi.date().timestamp();
export const description = Joi.string().min(1).max(30);
export const is_disable = Joi.boolean();

export const createPromotionSchema = Joi.object({
    name: name.required(),
    start_date: start_date.required(),
    end_date: end_date.min(Joi.ref("start_date")).required(),
    description,
    is_disable
});

export const updatePromotionSchema = Joi.object({
    name: name.required(),
    update_value: Joi.object({
        new_name: name,
        start_date: start_date,
        end_date: end_date,
        description,
        is_disable
    }).or(
        "new_name",
        "start_date",
        "end_date",
        "description",
        "is_disable"
    ).required()
});

export const discount = Joi.number().min(0.0).max(1);

export const commoditySchema = Joi.object({
    barcode: barcode.required(),
    promotion_type: name.required(),
    single_off_price: price,
    single_discount: discount,
    fill_off_price: price,
    fill_discount: discount
});

export const updatePromotionDetailsSchema = Joi.object({
    promotion_name: name.required(),
    commodity_list: Joi.array().min(1).max(200).items(commoditySchema).required()
});

export const deletePromotionSchema = Joi.object({
    name: name.required()
});