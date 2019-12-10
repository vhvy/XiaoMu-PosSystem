import express from "express";
import VipTasks from "../../tasks/vip.js";
import { throwError } from "../../middleware/handleError.js";
import { validBody } from "../../middleware/validBody.js";
import { createVipMemberSchema, updateVipMemberSchema, deleteVipMemberSchema } from "../../schema/vip_member.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取所有的会员信息

    const VipManage = new VipTasks();
    const result = await VipManage.getVipDetails();

    const data = await Promise.all(result.map(async item => {
        const { name: vip_type } = await VipManage.getVipTypeDetails(item["type_id"]);
        const obj = Object.assign({}, item, {
            vip_type
        });
        delete obj.type_id;
        return obj;
    }));

    res.json(data);
});

route.post("/create", validBody(
    createVipMemberSchema,
    "请输入正确的会员信息!"
), async (req, res, next) => {
    // 创建新会员

    const { code, name, vip_type, sex, phone, is_disable } = req.body;
    const VipManage = new VipTasks();

    const queryCodeResult = await VipManage.getVipDetails(code);
    if (queryCodeResult) {
        return throwError(next, "此会员卡号已存在!");
    }
    // 当会员卡号已存在时返回400

    const queryTypeResult = await VipManage.getVipTypeDetails(vip_type);
    if (!queryTypeResult) {
        return throwError(next, "此会员类型不存在!");
    }
    // 当此会员卡类型不存在时返回400

    const quertPhoneResult = await VipManage.getVipDetails(phone, "phone");
    if (quertPhoneResult) {
        return throwError(next, "此手机号已存在!");
    }
    // 当此手机号已存在时返回400

    const { lastID } = await VipManage.createVipMember({
        code, name, vip_type, sex, phone, is_disable
    });

    const result = await VipManage.getVipDetails(lastID, "id");

    res.json(result);
});

route.put("/update", validBody(
    updateVipMemberSchema,
    "请输入正确的会员信息!"
), async (req, res, next) => {
    // 更新会员信息

    const { code, update_value } = req.body;
    const VipManage = new VipTasks();

    const queryCodeResult = await VipManage.getVipDetails(code);
    if (!queryCodeResult) {
        return throwError(next, "此会员卡号不存在!");
    }
    // 当会员卡号不存在时返回400

    const { phone } = update_value;

    const quertPhoneResult = await VipManage.getVipTypeDetails(phone, "phone");
    if (quertPhoneResult) {
        return throwError(next, "此手机号已存在!");
    }
    // 当此手机号已存在时返回400

    await VipManage.updateVipMember({ ...update_value, code });

    res.json(
        { ...update_value, code }
    )
});

route.delete("/delete", validBody(
    deleteVipMemberSchema,
    "请输入正确的会员卡号!"
), async (req, res, next) => {
    const { code } = req.body;
    const VipManage = new VipTasks();

    const queryCodeResult = await VipManage.getVipDetails(code);
    if (!queryCodeResult) {
        return throwError(next, "此会员卡号不存在!");
    }
    // 当会员卡号不存在时返回400

    const checkUsedResult = await VipManage.checkVipMemberUsed(code);
    if (checkUsedResult) {
        return throwError(next, "会员卡已被使用过，无法删除!");
    }
    // 当会员卡已经发生过交易时拒绝删除返回400

    await VipManage.deleteVipMember(code);

    res.json({
        message: "删除成功!",
        code
    });
});

export default route;