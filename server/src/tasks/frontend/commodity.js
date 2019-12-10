import AppDAO from "../../data/AppDAO.js";

class CommodityTask {
    static async getCommodityDetails(query) {
        // 根据查询条件放回商品详情

        const query_fields = ["barcode", "pinyin", "name"]
        // 分别从条码、拼音首字母缩写、名称来查询

        const need_fields = "barcode, name, unit, size, sale_price";
        // 前台进行销售时需要的字段

        for (let key of query_fields) {
            const result = await AppDAO.all(`
            SELECT ${need_fields} FROM commodity 
            WHERE ${key}=?
            ;`, query);
            if (result.length !== 0) return result;
            // 精准匹配

            const result_fuzzy = await AppDAO.all(`
            SELECT ${need_fields} FROM commodity 
            WHERE ${key} LIKE ?
            ;`, `%${query}%`);

            if (result_fuzzy.length !== 0) return result_fuzzy;
            // 模糊匹配
        }

        return [];
    }
}

export default CommodityTask;