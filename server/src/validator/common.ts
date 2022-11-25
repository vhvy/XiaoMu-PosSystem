import Joi from "joi";

export const Page = Joi.number()
    .integer()
    .min(1)
    .error(new Error("分页页数不正确!"));

export const PageSize = Joi.number()
    .integer()
    .min(1);