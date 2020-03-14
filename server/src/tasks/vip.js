import AppDAO from "../data/AppDAO.js";
import { getPinyin } from "../lib/pinyin.js";
import { math } from "../lib/mathc.js";

class VipTasks {

    static async getVipDetails(vip, type = "code", needMap = true) {
        // 获取会员详细信息

        if (!vip) {
            let list = await AppDAO.all(`
            SELECT * FROM vip_info
            ;`);
            return await this.mapVipIdToDetails(list);
        }

        let result = await AppDAO.get(`
        SELECT * FROM vip_info WHERE ${type}=?
        ;`, [vip]);

        if (!result) return undefined;

        if (needMap) {
            return (await this.mapVipIdToDetails([result]))[0];

        }
        return result;
    }

    static async mapVipIdToDetails(list) {
        // 将会员类型id等信息转换为前端需要的字段

        const vip_type_list = await this.getAllVipType();


        return await Promise.all(list.map(async item => {
            const { name: vip_type } = vip_type_list.find(i => i.id === item["type_id"]);
            return Object.assign({}, item, {
                vip_type,
                is_disable: item.is_disable === 1
            });
        }));
    }

    static async getVipCurrentValue(vip, isId = false) {
        // 获取会员卡当前积分值

        if (isId) {
            return await AppDAO.get(`
                SELECT * FROM vip_value WHERE vip_id=?
        ;`, vip);
        }

        return await AppDAO.get(`
        SELECT * FROM vip_value WHERE vip_id=(
            SELECT id FROM vip_info WHERE code=?
        )
        ;`, vip);
    }

    static async getAllVipType() {
        // 获取所有会员卡类型

        return await AppDAO.all(`
        SELECT * FROM vip_type
        ;`);
    }

    static async getVipTypeDetails(type) {
        // 获取会员卡类型详情

        const query = (typeof type === "number") ? "id" : "name";
        return await AppDAO.get(`
        SELECT * FROM vip_type WHERE ${query}=?
        ;`, [type]);
    }

    static async createVipScoreMember(id) {
        // 创建积分卡会员记录

        return await AppDAO.run(`
        INSERT INTO vip_value (vip_id) 
        VALUES (?)
        ;`, [id]);
    }

    static async checkVipMemberIsChange(code) {
        return await AppDAO.get(`
        SELECT id FROM vip_change WHERE 
        old_code_id=(
            SELECT id FROM vip_info WHERE code=?
        )
        ;`, [code]);
    }

    static async changeVipMember(old_code, new_code, description = "无") {
        // 会员补换卡

        await this.updateVipMember({
            code: old_code,
            is_disable: true
        });
        // 禁用旧卡

        const old_value = await this.getVipDetails(old_code);

        const value = Object.assign({}, old_value, {
            work_type: "补换卡",
            code: new_code,
            is_disable: false,

        });
        delete value.id;

        const result = await this.createVipMember(value);

        await AppDAO.run(`
        INSERT INTO vip_change 
        (old_code_id, new_code_id, change_date, description) 
        VALUES (?, ?, ?, ?)
        ;`, [old_value.id, result.lastID, new Date().getTime(), description]);

        return result;
    }



    static async createVipMember({
        code, name, vip_type: vip_type_name = "积分卡", sex, phone, is_disable = false, work_type = "办理", create_date = new Date().getTime(), change_date, type_id
    }) {
        // 建立新的会员



        const pinyin = getPinyin(name);


        const _type_id = await (async () => {
            if (type_id) return type_id;
            const { id } = await this.getVipTypeDetails(vip_type_name);
            return id;
        })();

        const fields = ["code", "name", "type_id", "is_disable", "pinyin", "create_date", "change_date", "work_type"];
        const args = [code, name, _type_id, is_disable ? 1 : 0, pinyin, create_date, change_date ? change_date : create_date, work_type];
        if (sex) {
            fields.push("sex");
            args.push(sex);
        }

        if (phone) {
            fields.push("phone");
            args.push(phone);
        }

        const result = await AppDAO.run(`
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

    static async createVipMemberSnapshot(params) {
        const fields = [];
        const args = [];
        const keys = Object.keys(params);
        for (let key of keys) {
            fields.push(key);
            args.push(params[key]);
        }

        return await AppDAO.run(`
        INSERT INTO vip_info_snapshot 
        (${fields.join(", ")}) 
        VALUES (?${", ?".repeat(args.length - 1)})
        ;`, args);
    }

    static async updateVipMember(params) {
        // 更新会员信息

        const { code } = params;
        const old_value = await this.getVipDetails(code, "code", false);

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

        const result = await AppDAO.run(`
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

    static async checkVipMemberUsed(code) {
        // 检查会员卡是否已经发生过交易
        // 待完成前台销售API后再来完善

        return await AppDAO.get(`
        SELECT id FROM orders WHERE vip_code=?
        ;`, code);
    }

    static async deleteVipMemberSnapshot(vip_member_id) {
        // 删除会员卡修改记录

        return await AppDAO.run(`
        DELETE FROM vip_info_snapshot WHERE vip_member_id=?
        ;`, [vip_member_id]);
    }

    static async deleteVipMemberChange(id) {
        // 删除会员卡补换卡记录

        return await AppDAO.run(`
        DELETE FROM vip_change 
        WHERE old_code_id=?
        ;`, [id]);
    }

    static async deleteVipMemberValue(id) {
        // 删除会员卡积分条目

        return await AppDAO.run(`
        DELETE FROM vip_value 
        WHERE vip_id=?
        ;`, [id]);
    }

    static async deleteVipMember(code) {
        const { id } = await this.getVipDetails(code);
        await this.deleteVipMemberSnapshot(id);

        await this.deleteVipMemberChange(id);

        await this.deleteVipMemberValue(id);

        return await AppDAO.run(`
        DELETE FROM vip_info WHERE id=?
        ;`, [id]);
    }

    static async addVipPoints(id, point) {
        // 增加会员积分

        return await AppDAO.run(`
        UPDATE vip_value 
        SET vip_sum=vip_sum+? 
        WHERE vip_id=?
        ;`, [point, id]);
    }

    static async undoOrderMinusVipPoints(code, point, price) {
        // 撤销订单时减少会员积分

        const { vip_id, vip_sum, sale_sum } = await this.getVipCurrentValue(code);

        const new_vip_sum = math.subtract(vip_sum, point);
        const new_sale_sum = math.subtract(sale_sum, price);

        return await AppDAO.run(`
        UPDATE vip_value 
        SET vip_sum=?, sale_sum=?, consume_count=consume_count-1
        WHERE vip_id=?
        ;`, [new_vip_sum, new_sale_sum, vip_id]);
    }

    static async minusVipPoints(code, point) {
        // 减少会员积分

        const { vip_id, vip_sum } = await this.getVipCurrentValue(code);

        const new_vip_sum = math.subtract(vip_sum, point);

        return await AppDAO.run(`
        UPDATE vip_value 
        SET vip_sum=? 
        WHERE vip_id=?
        ;`, [new_vip_sum, vip_id]);
    }

    static async vipConsumeAddPoints(code, point, sum) {
        // 会员购物后增加积分、消费次数、总的消费金额

        const { id } = await AppDAO.get(`
            SELECT id FROM vip_info WHERE code=?
        ;`, code);

        const { vip_sum: c_vip_sum, sale_sum: c_sale_sum } = await AppDAO.get(`
        SELECT vip_sum, sale_sum FROM vip_value WHERE vip_id=?
        ;`, id);

        const vip_sum = math.add(point, c_vip_sum);
        const sale_sum = math.add(sum, c_sale_sum);

        return await AppDAO.run(`
        UPDATE vip_value 
        SET vip_sum=?, sale_sum=?, consume_count=consume_count+1 
        WHERE vip_id=?
        ;`, [vip_sum, sale_sum, id]);
    }

    static async getVipPointsRules() {
        // 获取会员卡积分比例

        const { money, point } = await AppDAO.get(`
        SELECT * FROM vip_score_rules
        ;`);

        const result = math.divide(point, money);

        return result;
    }

    static async setVipPointsRules(point) {
        // 设置会员卡积分比例

        return await AppDAO.run(`
        UPDATE vip_score_rules SET point=? WHERE (
            SELECT id FROM vip_score_rules
        )
        ;`, point);
    }

    static async setVipPoint(code, point, type) {
        if (type) {
            const { vip_id } = await this.getVipCurrentValue(code);
            return await this.addVipPoints(vip_id, point);
        } else {
            return await this.minusVipPoints(code, point);
        }
    }
}

export default VipTasks;