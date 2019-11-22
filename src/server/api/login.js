import express from "express";
import Joi from "@hapi/joi";

const userSchema = Joi.object({
    username: Joi.string().min(1).max(13).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{5,30}$/).required()
});

const route = express.Router();

route.post("/", async (req, res) => {
    // const { username, password } = req.body;
    const result = userSchema.validate(req.body);
    if (result.error) return res.status(401).json({
        message: "请输入合法的用户名和密码!"
    });
    res.json({
        message: "登录成功!",
        token: "vn287fha8w4r8Q8ERQ89E2EUFH8981U2E1987283"
    });
});

export default route;