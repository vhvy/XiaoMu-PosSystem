import AppDAO from "../data/AppDAO.js";

class CategoriesTask {
    constructor() {
        this.dao = AppDAO;
    }

    async createCategory(category, parent_name) {
        // 创建新商品分类

        if (parent_name) {
            const { id: parent_id } = await this.dao.get(`
            SELECT id FROM categories WHERE name=?
            ;`, [parent_name]);
            return this.dao.run(`
            INSERT INTO categories 
            (name, parent_id) 
            VALUES (?, ?)
            ;`, [category, parent_id]);
        }

        return this.dao.run(`
        INSERT INTO categories 
        (name) 
        VALUES (?)
        ;`, [
            category
        ]);
    }

    getCategoryDetails(name) {
        const query = (typeof name === "number") ? "id" : "name";
        return this.dao.get(`
            SELECT id, name, parent_id FROM categories WHERE ${query}=?
            ;`, [name]);
    }

    updateCategoryName(old_name, new_name) {
        return this.dao.run(`
        UPDATE categories SET name=? 
        WHERE name=?
        ;`, [
            new_name,
            old_name
        ]);
    }

    async deleteCategory(category) {
        // 删除分类

        const del = (id) => {
            return this.dao.run(`
            DELETE FROM categories WHERE id=?
            ;`, [id]);
        }

        const { id, parent_id } = await this.getCategoryDetails(category);
        if (!parent_id) {
            // 如果没有父分类，那么它可能是一个父分类，需要将子分类一同删除
            const child_id_list = await this.dao.all(`
            SELECT id FROM categories WHERE parent_id=?
            ;`, [id]);

            if (child_id_list.length !== 0) {
                await Promise.all(child_id_list.map(
                    async ({ id }) => await del(id)
                ));
            }
            return await del(id);
        }

        return await del(id);
    }

    async getChildCategory(parent_name) {
        const { id } = await this.getCategoryDetails(parent_name);
        return this.dao.all(`
        SELECT id, name, parent_id FROM categories WHERE parent_id=?
        ;`, [id]);
    }

    async updateCategoryParent(name, parent_name) {
        const { id } = await this.getCategoryDetails(parent_name);
        return this.dao.run(`
        UPDATE categories 
        SET parent_id=? 
        WHERE name=?
        ;`, [id, name]);
    }

    async getCategoriesDetails() {
        return await this.dao.all(`
        SELECT id, name, parent_id FROM categories
        ;`);
    }

}

export default CategoriesTask;