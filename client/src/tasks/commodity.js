export class CommodityTasks {
    static query(ajax, key) {
        return ajax.get(`/api/front/commodity/${encodeURIComponent(key)}`);
    }

    static queryByCategory(ajax, category) {
        const query = encodeURIComponent(category.join(","));
        return ajax.get(`/api/warehouse/commodity?list=${query}`);
    }

    static createCommodity(ajax, value) {
        return ajax.post("/api/warehouse/commodity/create", value);
    }

    static updateCommodity(ajax, current_barcode, update_value) {
        return ajax.put("/api/warehouse/commodity/update", {
            current_barcode,
            update_value
        });
    }

    static deleteCommodity(ajax, barcode) {
        return ajax.delete(`/api/warehouse/commodity/delete/${encodeURIComponent(barcode)}`);
    }
}