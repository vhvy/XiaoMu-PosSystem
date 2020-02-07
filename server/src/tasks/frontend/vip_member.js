import AppDAO from "../../data/AppDAO.js";

class VipMemberTask {
    static async getVipMemberDetails(query) {
        // 获取会员的详细信息

        const query_fields = ["code", "pinyin", "name", "phone"];
        // 根据查询字段分别进行精准和模糊匹配

        const need_fields = "id, code, name, phone, is_disable";

        for (let key of query_fields) {
            const result = await AppDAO.all(`
            SELECT ${need_fields} FROM vip_info 
            WHERE ${key}=?
            ;`, query);

            if (result.length !== 0) return result;
            // 当精准匹配到结果时返回结果

            const result_fuzzy = await AppDAO.all(`
            SELECT ${need_fields} FROM vip_info 
            WHERE ${key} LIKE ?
            ;`, `%${query}%`);

            if (result_fuzzy.length !== 0) return result_fuzzy;
            // 当模糊匹配到结果时返回结果
        }

        return [];
        // 没有匹配到任何结果时返回空数组
    }

    static async mapValueToVipDetails(id) {
        return await AppDAO.get(`
        SELECT vip_sum, consume_count FROM vip_value 
        WHERE vip_id=?
        ;`, id);
    }
}

export default VipMemberTask;