import express from "express";
import { validToken } from "../../middleware/auth.js";
import { throwError } from "../../middleware/handleError.js";

const route = express.Router();

route.get("/auth", async (req, res, next) => {

    const token = req.headers["authorization"];
    if (!token) {
        return res.send(false);
    }

    try {
        const result = await validToken(token);
        res.json(result);
    } catch (err) {
        return throwError(next, "无效凭证!请重新登录!", 401);
    }
});

export default route;