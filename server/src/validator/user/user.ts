import Joi from "joi";

// 用户登录账号
const userAccount = Joi.string()
    .trim()
    .alphanum()
    .min(4)
    .max(10)
    .required();

// 用户昵称
const userName = Joi.string()
    .trim()
    .min(3)
    .max(7)
    .required();

// 用户密码
const userPwd = Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(16)
    .required();

export const userLoginSchema = Joi.object({
    account: userAccount,
    password: userPwd
}).required();