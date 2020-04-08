export class DataManage {
    static importCommodity(ajax, data) {
        // 导入商品

        return ajax.post("/api/data/import/commodity", data);
    }

    static exportData(ajax, type) {
        // 导出数据

        return ajax.get("/api/data/export", {
            type
        });
    }
}