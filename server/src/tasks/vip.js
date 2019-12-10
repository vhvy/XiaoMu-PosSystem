import AppDAO from "../data/AppDAO.js";
import { getPinyin } from "../lib/pinyin.js";

class VipTasks {
    constructor() {
        this.dao = AppDAO;
    }

    async getVipDetails(vip, type = "code") {
        // 获取会员详细信息

        if (!vip) {
            return await this.dao.all(`
            SELECT * FROM vip_info
            ;`);
        }

        if (type === "name") {
            return await this.dao.all(`
            SELECT * FROM vip_info WHERE ${type}=?
            ;`, [vip]);
        }

        return await this.dao.get(`
        SELECT * FROM vip_info WHERE ${type}=?
        ;`, [vip]);
    }

    async getVipTypeDetails(type) {
        // 获取会员卡类型详情

        const query = (typeof type === "number") ? "id" : "name";
        return await this.dao.get(`
        SELECT * FROM vip_type WHERE ${query}=?
        ;`, [type]);
    }

    async createVipScoreMember(id) {
        return await this.dao.run(`
        INSERT INTO vip_value (vip_id) 
        VALUES (?)
        ;`, [id]);
    }

    async createVipMember({
        code, name, vip_type: vip_type_name, sex, phone, is_disable = false
    }) {
        // 建立新的会员

        const pinyin = getPinyin(name);
        const time = new Date().getTime();
        const { id: type_id } = await this.getVipTypeDetails(vip_type_name);

        const fields = ["code", "name", "type_id", "is_disable", "pinyin", "create_date", "change_date"];
        const args = [code, name, type_id, is_disable ? 1 : 0, pinyin, time, time];
        if (sex) {
            fields.push("sex");
            args.push(sex);
        }

        if (phone) {
            fields.push("phone");
            args.push(phone);
        }

        const result = await this.dao.run(`
        INSERT INTO vip_info 
        (${fields.join(", ")}) 
        VALUES (?${", ?".repeat(fields.length - 1)})
        ;`, args);
        const { lastID } = result;

        switch (vip_type_name) {
            case "积分卡":
                await this.createVipScoreMember(lastID);
                break;
        }

        return result;
    }

    async createVipMemberSnapshot(params) {
        const fields = [];
        const args = [];
        const keys = Object.keys(params);
        for (let key of keys) {
            fields.push(key);
            args.push(params[key]);
        }

        return await this.dao.run(`
        INSERT INTO vip_info_snapshot 
        (${fields.join(", ")}) 
        VALUES (?${", ?".repeat(args.length - 1)})
        ;`, args);
    }

    async updateVipMember(params) {
        // 更新会员信息

        const { code } = params;
        const old_value = await this.getVipDetails(code);

        const change_date = new Date().getTime();
        const fields = ["change_date=?"];
        const args = [change_date, code];

        const keys = Object.keys(params);
        for (let key of keys) {
            if (key !== "code") {
                fields.unshift(key + "=?");
                args.unshift(params[key]);
            }
        }

        const result = await this.dao.run(`
        UPDATE vip_info SET
        ${fields.join(", ")} 
        WHERE code=?
        ;`, args);

        const snapshotData = Object.assign({}, old_value, {
            vip_member_id: old_value["id"],
            change_date: change_date
        });
        delete snapshotData.id;

        await this.createVipMemberSnapshot(snapshotData);

        return result;
    }

    async checkVipMemberUsed(code) {
        // 检查会员卡是否已经发生过交易
        // 待完成前台销售API后再来完善

        return false;
    }

    async deleteVipMemberSnapshot(vip_member_id) {
        return await this.dao.run(`
        DELETE FROM vip_info_snapshot WHERE vip_member_id=?
        ;`, [vip_member_id]);
    }

    async deleteVipMember(code) {
        const { id } = await this.getVipDetails(code);

        await this.deleteVipMemberSnapshot(id);

        return await this.dao.run(`
        DELETE FROM vip_info WHERE id=?
        ;`, [id]);
    }
}

export default VipTasks;