import Joi from "@hapi/joi";
import {
    createCommoditySchema
} from "./commodity.js";

const commodityRules = Joi.object({
    barcode_exist: Joi.bool().required(),
    category_exist: Joi.bool().required(),
    supplier_exist: Joi.bool().required()
}).required();

const commodityList = Joi.array().min(1).max(10000).items(createCommoditySchema).required();

export const importCommpditySchema = Joi.object({
    rules: commodityRules,
    data: commodityList
});

const typeList = ["commodity", "vip", "sales"];

export const exportDataSchema = Joi.object({
    type: Joi.string().valid(...typeList).required()
});