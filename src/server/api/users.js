import express from "express";
import Joi from "@hapi/joi";

const changePwdSchema = Joi.object().keys({
    username: Joi.string().min(1).max(13).required(),
    oldPwd: Joi.string().pattern(/^[a-zA-Z0-9]{5,30}$/).required(),
    newPwd: Joi.string().pattern(/^[a-zA-Z0-9]{5,30}$/).invalid(Joi.ref("oldPwd")).required()
});

const route = express.Router();

route.get("/", async (req, res) => {
    res.send({
        data: [
            "password"
        ]
    })
});

route.post("/changepwd", async (req, res) => {
    const body = req.body;
    const result = changePwdSchema.validate(body);
    console.log(result);
    if (!result.error) {
        res.json({
            message: "修改成功!"
        })
    } else {
        res.status(403).json({
            message: "修改失败!"
        })
    }
});

export default route;