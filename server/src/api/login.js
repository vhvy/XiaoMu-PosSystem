import express from "express";
import UserTask from "../tasks/users.js";
import Jwt from "../lib/jwt.js";
import { userPwdSchema } from "../schema/user.js";


const route = express.Router();

route.post("/", async (req, res, next) => {
    const { username, password } = req.body;
    const result = userPwdSchema.validate(req.body);
    if (result.error) {
        const err = new Error("请输入合法的用户名和密码!");
        err.status = 401;
        return next(err);
    }
    
    const { status, message } = await UserTask.validateAccount(username, password);
    if (status) {
        const {
            authorityList,
            group,
            group_id
        } = await UserTask.getUserAuthority(username, true);

        const token = await Jwt.sign({
            username,
            authority: authorityList
        });

        res.json({
            message: "登录成功!",
            token,
            authority: authorityList,
            username,
            group,
            group_id
        });
    } else {
        res.status(401).json({
            message
        });
    }
});

export default route;