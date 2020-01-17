export class CommodityTasks {
    static query(ajax, key) {
        return ajax.get(`/api/front/commodity/${encodeURIComponent(key)}`);
    }

    static queryByCategory(ajax, category) {
        const query = encodeURIComponent(category.join(","));
        return ajax.get(`/api/warehouse/commodity?list=${query}`);
    }
}