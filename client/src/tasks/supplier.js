export class SupplierTask {
    static createSupplier(ajax, name, phone, description) {
        const data = {
            name
        };

        if (phone) {
            data.phone = phone
        }
        if (description) {
            data.description = description;
        }

        return ajax.post("/api/warehouse/suppliers/create", data);
    }

    static getSupplier(ajax) {
        return ajax.get("/api/warehouse/suppliers");
    }

    static updateSupplier(ajax, name, update_value) {
        return ajax.put("/api/warehouse/suppliers/update", {
            name,
            update_value
        });
    }

    static deleteSupplier(ajax, name) {
        return ajax.delete(`/api/warehouse/suppliers/delete/${encodeURIComponent(name)}`);
    }
}