export class DataManage {
    static importCommodity(ajax, data) {
        return ajax.post("/api/data/import/commodity", data);
    }
}