export class VipManage {
    static frontQurey(ajax, query) {
        return ajax.get(`/api/front/vip/${encodeURIComponent(query)}`);
    }

    static getAllVip(ajax) {
        return ajax.get("/api/vip/members");
    }

    static delVipMember(ajax, code) {
        return ajax.delete(`/api/vip/members/delete/${encodeURIComponent(code)}`);
    }

    static disableVipMember(ajax, code) {
        return ajax.put("/api/vip/members/update", {
            code,
            update_value: {
                is_disable: true
            }
        });
    }

    static enableVipMember(ajax, code) {
        return ajax.put("/api/vip/members/update", {
            code,
            update_value: {
                is_disable: false
            }
        });
    }

    static createVipMember(ajax, data) {
        return ajax.post("/api/vip/members/create", data);
    }

    static updateVipMember(ajax, code, update_value) {
        return ajax.put("/api/vip/members/update", {
            code,
            update_value
        });
    }

    static getVipPointRules(ajax) {
        return ajax.get("/api/vip/members/pointrules");
    }

    static updateVipPointRules(ajax, value) {
        return ajax.put("/api/vip/members/pointrules", {
            value
        });
    }

    static vipChangeCard(ajax, data) {
        return ajax.post("/api/vip/members/change", data);
    }

    static setVipPoint(ajax, code, point, type) {
        return ajax.put("/api/vip/members/setpoint", {
            point,
            code,
            type: type === "add"
        });
    }
}