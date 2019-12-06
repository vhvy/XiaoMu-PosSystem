import Joi from "@hapi/joi";

export const group = Joi.string().min(2).max(10).required();
export const authority = Joi.array().min(1).items(Joi.string().required()).required();

export const createGroupSchema = Joi.object({
    name: group,
    authority
});

export const updateGroupNameSchema = Joi.object({
    name: group,
    new_name: Joi.string().min(2).max(10).invalid(Joi.ref("name")).required()
});

export const updateGroupAuthoritySchema = Joi.object({
    name: group,
    new_authority: authority
});