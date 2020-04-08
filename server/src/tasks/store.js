import AppDAO from "../data/AppDAO.js";

export class StoreTasks {

    static async getStoreName() {
        // 获取店铺名称
        return await AppDAO.get(`
        SELECT * FROM store_config
        ;`);
    }

    static async setStoreName(name) {
        // 设置店铺名称

        const { id } = await this.getStoreName();

        return await AppDAO.run(`
        UPDATE store_config SET 
        name=? 
        WHERE id=?
        ;`, [name, id]);
    }
}