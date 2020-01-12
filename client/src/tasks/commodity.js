export class CommodityTasks {
    static query(ajax, key) {
        return ajax.get(`/api/front/commodity/${key}`);
    }
}