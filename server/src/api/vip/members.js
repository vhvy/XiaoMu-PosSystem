import express from "express";
import VipTasks from "../../tasks/vip.js";
import { throwError } from "../../middleware/handleError.js";
import { validBody } from "../../middleware/validBody.js";
import {
    createVipMemberSchema,
    updateVipMemberSchema,
    changeVipMemberSchema,
    setVipPointRuleSchema,
    setVipPointSchema
} from "../../schema/vip_member.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取所有的会员信息

    const result = await VipTasks.getVipDetails();

    res.json(result);
});

route.get("/pointrules", async (req, res) => {
    // 获取会员积分比例

    const result = await VipTasks.getVipPointsRules();

    res.send({
        result
    });
});

route.put("/pointrules", validBody(setVipPointRuleSchema,
    "请输入正确的积分值!"
), async (req, res) => {
    // 设置会员积分比例

    const { value } = req.body;

    await VipTasks.setVipPointsRules(value);

    res.json({
        value
    });
});

route.post("/create", validBody(
    createVipMemberSchema,
    "请输入正确的会员信息!"
), async (req, res, next) => {
    // 创建新会员

    const { code, name, vip_type, sex, phone, is_disable } = req.body;

    const queryCodeResult = await VipTasks.getVipDetails(code);
    if (queryCodeResult) {
        return throwError(next, "此会员卡号已存在!");
    }

    // 当会员卡号已存在时返回400

    const queryTypeResult = await VipTasks.getVipTypeDetails(vip_type);
    if (!queryTypeResult) {
        return throwError(next, "此会员类型不存在!");
    }
    // 当此会员卡类型不存在时返回400


    const { lastID } = await VipTasks.createVipMember({
        code, name, vip_type, sex, phone, is_disable
    });

    const result = await VipTasks.getVipDetails(lastID, "id");
    res.json(result);
});

route.put("/update", validBody(
    updateVipMemberSchema,
    "请输入正确的会员信息!"
), async (req, res, next) => {
    // 更新会员信息

    const { code, update_value } = req.body;

    const queryCodeResult = await VipTasks.getVipDetails(code);
    if (!queryCodeResult) {
        return throwError(next, "此会员卡号不存在!");
    }
    // 当会员卡号不存在时返回400

    if (update_value.is_disable !== undefined) {
        const checkOldIsChangeResult = await VipTasks.checkVipMemberIsChange(code);
        if (checkOldIsChangeResult) {
            return throwError(next, "此卡已补换过卡!");
        }
        // 会员卡已经补换卡时返回400
    }

    await VipTasks.updateVipMember({ ...update_value, code });

    res.json(
        { ...update_value, code }
    )
});

route.delete("/delete/:code", async (req, res, next) => {
    // 删除会员

    const { code } = req.params;

    const queryCodeResult = await VipTasks.getVipDetails(code);
    if (!queryCodeResult) {
        return throwError(next, "此会员卡号不存在!");
    }
    // 当会员卡号不存在时返回400

    const checkUsedResult = await VipTasks.checkVipMemberUsed(code);
    if (checkUsedResult) {
        return throwError(next, "会员卡已被使用过，无法删除!");
    }
    // 当会员卡已经发生过交易时拒绝删除返回400

    await VipTasks.deleteVipMember(code);

    res.json({
        message: "删除成功!",
        code
    });
});

route.post("/change", validBody(
    changeVipMemberSchema,
    "请输入正确的会员卡号!"
), async (req, res, next) => {
    // 会员补换卡

    const { old_code, new_code, description } = req.body;

    const queryCodeResult = await VipTasks.getVipDetails(old_code);
    if (!queryCodeResult) {
        return throwError(next, "此会员卡号不存在!");
    }
    // 当会员卡号不存在时返回400

    if (queryCodeResult.is_disable) {
        return throwError(next, "此卡号已被禁用!");
    }
    // 会员卡被禁用时返回400

    const checkOldIsChangeResult = await VipTasks.checkVipMemberIsChange(old_code);
    if (checkOldIsChangeResult) {
        return throwError(next, "此卡已补换过卡!");
    }
    // 会员卡已经补换卡时返回400

    const queryNewCodeResult = await VipTasks.getVipDetails(new_code);
    if (queryNewCodeResult) {
        return throwError(next, "新的会员卡号已存在!");
    }
    // 当新的会员卡号已存在时返回400

    await VipTasks.changeVipMember(old_code, new_code, description);

    res.json({
        old_code,
        new_code
    });
});

route.put("/setpoint", validBody(
    setVipPointSchema,
    "请输入正确的调整信息!"
), async (req, res, next) => {

    const { point, type, code } = req.body;

    const queryCodeResult = await VipTasks.getVipDetails(code);
    if (!queryCodeResult) {
        return throwError(next, "此会员卡号不存在!");
    }
    // 当会员卡号不存在时返回400

    if (queryCodeResult.is_disable) {
        return throwError(next, "此卡号已被禁用!");
    }
    // 会员卡被禁用时返回400

    await VipTasks.setVipPoint(code, point, type);

    res.send({
        message: "积分调整完成!"
    });
});

export default route;