import AppDAO from "../../data/AppDAO.js";

class VipMemberTask {
    static async getVipMemberDetails(query) {
        // 获取会员的详细信息

        const query_fields = ["code", "pinyin", "name", "phone"];
        // 根据查询字段分别进行精准和模糊匹配

        const need_fields = "code, name, phone";

        for (let key of query_fields) {
            const result = await AppDAO.all(`
            SELECT ${need_fields} FROM vip_info 
            WHERE ${key}=?
            ;`, query);

            if (result.length !== 0) return result;

            const result_fuzzy = await AppDAO.all(`
            SELECT ${need_fields} FROM vip_info 
            WHERE ${key} LIKE ?
            ;`, `%${query}%`);

            if (result_fuzzy.length !== 0) return result_fuzzy;
        }

        return [];
    }
}

export default VipMemberTask;