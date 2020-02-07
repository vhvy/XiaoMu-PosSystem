import express from "express";
import VipMemberTask from "../../tasks/frontend/vip_member.js";


const route = express.Router();

route.get("/:query", async (req, res) => {
    // 获取会员的详细信息

    const { query } = req.params;
    const result = await VipMemberTask.getVipMemberDetails(query.toUpperCase());
    const details = await Promise.all(result.map(async ({ id, is_disable, ...filed }) => ({
        id,
        type: "积分卡",
        is_disable: is_disable === 1,
        ...filed,
        ...await VipMemberTask.mapValueToVipDetails(id)
    })));
    res.send(details);
});

export default route;