import Joi from "@hapi/joi";

export const code = Joi.string().regex(/^\d{4,10}$/);
export const name = Joi.string().min(1).max(10);
export const vip_type = Joi.string().min(1).max(10);
export const sex = Joi.string().regex(/^[男女]$/);
export const phone = Joi.string().min(5).max(13);
export const is_disable = Joi.boolean();


export const setVipPointSchema = Joi.object({
    code: code.required(),
    point: Joi.number().min(0.01).max(10000).required(),
    type: Joi.bool().required()
});

export const setVipPointRuleSchema = Joi.object({
    value: Joi.number().min(1).max(100).required()
});

export const createVipMemberSchema = Joi.object({
    code: code.required(),
    name: name.required(),
    vip_type,
    sex,
    phone,
    is_disable
});

export const updateVipMemberSchema = Joi.object({
    code: code.required(),
    update_value: Joi.object({
        name,
        sex,
        phone,
        is_disable
    }).or(
        "name", "sex", "phone", "is_disable"
    ).required()
});

export const deleteVipMemberSchema = Joi.object({
    code: code.required()
});

export const changeVipMemberSchema = Joi.object({
    old_code: code.required(),
    new_code: code.invalid(Joi.ref("old_code")).required(),
    description: Joi.string()
});