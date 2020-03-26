import express from "express";
import TodayTasks from "../tasks/today.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取门店当天的销售数据

    const { isAdmin, username } = req["jwt_value"];

    const data = await TodayTasks.getTodayData(isAdmin, username);

    res.json(data);
});

export default route;