import AppDAO from "../data/AppDAO.js";

class SuppliersTask {

    static async getSupplierDetails(arg) {
        // 获取供应商详情

        if (!arg) {
            return await AppDAO.all(`
            SELECT * FROM suppliers
            ;`);
        }

        const query = (typeof arg === "number") ? "id" : "name";
        return await AppDAO.get(`
        SELECT * FROM suppliers WHERE ${query}=?
        ;`, arg);
    }

    static async createSupplier(name, phone, description) {
        const fields = ["name"];
        const args = [name];
        let placeholder = "?";

        if (phone) {
            fields.push("phone");
            args.push(phone);
            placeholder += ", ?"
        }

        if (description) {
            fields.push("description");
            args.push(description);
            placeholder += ", ?"
        }

        return await AppDAO.run(`
        INSERT INTO suppliers 
        (${fields.join(", ")})
        VALUES (${placeholder})
        ;`, args);
    }

    static async updateSupplier({
        name,
        new_name,
        new_phone,
        new_description
    }) {
        const fields = [];
        const args = [name];

        if (new_name) {
            fields.unshift("name=?");
            args.unshift(new_name);
        }
        if (new_phone) {
            fields.unshift("phone=?");
            args.unshift(new_phone);
        }
        if (new_description) {
            fields.unshift("description=?");
            args.unshift(new_description);
        }

        return await AppDAO.run(`
        UPDATE suppliers SET ${fields.join(", ")} 
        WHERE name=?
        ;`, args);
    }

    static async checkSupplierIsUse(name) {
        const { id } = await this.getSupplierDetails(name);

        return await AppDAO.get(`
        SELECT id FROM commodity WHERE supplier_id=?
        ;`, [id]);
    }

    static async deleteSupplier(name) {
        return await AppDAO.run(`
        DELETE FROM suppliers WHERE name=?
        ;`, [name]);
    }
}

export default SuppliersTask;