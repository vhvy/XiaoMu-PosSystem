export class Order {
    static submitOrder(ajax, data) {
        return ajax.post("/api/front/order/submit", data);
    }

    static historyOrder(ajax) {
        return ajax.get("/api/front/order");
    }

    static undoOrder(ajax, order_id) {
        return ajax.put("/api/front/order/undo", {
            order_id
        });
    }

    static addVipOrder(ajax, order_id, vip_code) {
        return ajax.put("/api/front/order/addvip", {
            order_id,
            vip_code
        });
    }
}