import Joi from "@hapi/joi";
// import { group } from "./group.js";

export const group = Joi.string().min(2).max(10).required();
const username = Joi.string().min(1).max(13).required();
const password = Joi.string().pattern(/^[a-zA-Z0-9]{5,30}$/).required();


export const userPwdSchema = Joi.object({
    username,
    password
});

export const newUserSchema = Joi.object({
    new_username: username,
    password,
    group
});

export const updateUserPwdSchema = Joi.object({
    username,
    new_password: password
});

export const updateUserStatusSchema = Joi.object({
    username,
    status: Joi.boolean().required()
});

export const updateUserNameSchema = Joi.object({
    old_username: username,
    new_username: Joi.string().min(1).max(13).invalid(Joi.ref("old_username")).required()
});

export const updateUserGroupSchema = Joi.object({
    username,
    new_group: group
});