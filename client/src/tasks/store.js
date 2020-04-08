export class StoreTasks {
    static getStoreName(ajax) {
        // 获取店铺名称

        return ajax.get("/api/store/name");
    }

    static setStoreName(ajax, name) {
        // 设置店铺名称

        return ajax.put("/api/store/name", {
            name
        });
    }
}