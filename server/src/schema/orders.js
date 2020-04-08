import Joi from "@hapi/joi";
import { code } from "./vip_member.js";
import { barcode, sale_price } from "./commodity.js";

export const price = Joi.number().min(0).max(100000);
export const negative_price = Joi.number().max(100000);
export const order_id = Joi.number().min(100000000000000);
export const count = Joi.number().min(0.01).max(10000);

export const commodity = Joi.object({
    barcode: barcode.required(),
    sale_price: negative_price.required(),
    origin_price: price.required(),
    count: count.required(),
    status: Joi.string().min(1).max(5)
});

export const createOrderSchema = Joi.object({
    vip_code: code,
    pay_type: Joi.string().min(1).max(5),
    origin_price: price.required(),
    sale_price: negative_price.required(),
    client_pay: negative_price.required(),
    change: price,
    count: count.required(),
    commodity_list: Joi.array().min(1).max(200).items(commodity).required()
});

export const undoOrderSchema = Joi.object({
    order_id: order_id.required()
});

export const addOrderVipSchema = Joi.object({
    order_id: order_id.required(),
    vip_code: code.required()
});