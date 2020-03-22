import Joi from "@hapi/joi";

export const storeNameSchema = Joi.object({
    name: Joi.string().min(1).max(10).required()
});