import express from "express";
import VipMemberTask from "../../tasks/frontend/vip_member.js";


const route = express.Router();

route.get("/:query", async (req, res) => {
    // 获取会员的详细信息

    const { query } = req.params;
    const result = await VipMemberTask.getVipMemberDetails(query.toUpperCase());

    res.send(result);
});

export default route;