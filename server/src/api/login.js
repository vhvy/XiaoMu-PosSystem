import express from "express";
import UserTask from "../tasks/users.js";
import Jwt from "../lib/jwt.js";
import { validBody } from "../middleware/validBody.js";
import { userPwdSchema } from "../schema/user.js";
import { throwError } from "../middleware/handleError.js";
import config from "../config/index.js";
import { StoreTasks } from "../tasks/store.js";

const { default_admin_group_name } = config;

const route = express.Router();

route.post("/",
    validBody(userPwdSchema, "请输入合法的用户名和密码!"),
    async (req, res, next) => {
        const { username, password } = req.body;

        const { status, message, type } = await UserTask.validateAccount(username, password);
        if (!status) {
            req.custom_error_data = { type };
            return throwError(next, message, 401);
        }
        // 当认证失败时返回401

        const { name: store_name } = await StoreTasks.getStoreName();
        // 店铺名称

        const {
            authorityList,
            group,
            group_id
        } = await UserTask.getUserAuthority(username, true);

        const token = await Jwt.sign({
            username,
            authority: authorityList,
            isAdmin: default_admin_group_name === group
        });

        return res.json({
            message: "登录成功!",
            token,
            authority: authorityList,
            username,
            group,
            group_id,
            isAdmin: default_admin_group_name === group,
            store_name
        });

    });

export default route;