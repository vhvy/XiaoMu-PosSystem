export class StockTasks {
    static getAllStock(ajax) {
        return ajax.get("/api/warehouse/stock");
    }

    static getStockDetails(ajax, id) {
        return ajax.get(`/api/warehouse/stock/${encodeURIComponent(id)}`);
    }

    static createStockOrder(ajax, data) {
        return ajax.post("/api/warehouse/stock/create", data);
    }
}