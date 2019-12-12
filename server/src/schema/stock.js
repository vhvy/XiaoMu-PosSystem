import Joi from "@hapi/joi";
import { name as supplier_name } from "./suppliers.js";
import { barcode, in_price } from "./commodity.js";

export const commodity_item = Joi.object({
    barcode: barcode.required(),
    count: Joi.string().min(1).max(50).required(),
    in_price: in_price.required()
});

export const createStockSchema = Joi.object({
    supplier_name: supplier_name.required(),
    description: Joi.string().min(1).max(50),
    commodity_list: Joi.array().min(1).max(200).items(commodity_item).required()
});