import express from "express";
import { validToken } from "../../middleware/auth.js";
import { throwError } from "../../middleware/handleError.js";
import { StoreTasks } from "../../tasks/store.js";

const route = express.Router();

route.get("/auth", async (req, res, next) => {

    const token = req.headers["authorization"];
    if (!token) {
        return res.send(false);
    }

    try {
        const user_values = await validToken(token);

        const { name: store_name } = await StoreTasks.getStoreName();
        res.json({
            user_values,
            store_name
        });
    } catch (err) {
        return throwError(next, "无效凭证!请重新登录!", 401);
    }
});

export default route;