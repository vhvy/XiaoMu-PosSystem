import Joi from "@hapi/joi";

export const timeStampSchema = Joi.date().timestamp().required();

const queryTypeSchema = Joi.string().min(1).max(10).required();

const queryKeySchema = Joi.string().min(1).max(30).required();

export const ordersSchema = Joi.object({
    start_time: timeStampSchema,
    end_time: timeStampSchema
});

export const queryOrdersSchema = Joi.object({
    start_time: timeStampSchema,
    end_time: timeStampSchema,
    query: queryKeySchema,
    type: queryTypeSchema
});