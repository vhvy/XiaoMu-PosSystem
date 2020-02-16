import AppDAO from "../data/AppDAO.js";

class CategoriesTask {

    static async createCategory(category, parent_name) {
        // 创建新商品分类

        if (parent_name) {
            const { id: parent_id } = await AppDAO.get(`
            SELECT id FROM categories WHERE name=?
            ;`, [parent_name]);
            return AppDAO.run(`
            INSERT INTO categories 
            (name, parent_id) 
            VALUES (?, ?)
            ;`, [category, parent_id]);
        }

        return AppDAO.run(`
        INSERT INTO categories 
        (name) 
        VALUES (?)
        ;`, category);
    }

    static async checkCategoryHasCommodity(category) {

        function query(id) {
            return AppDAO.get(`
            SELECT id FROM commodity WHERE category_id=?
            ;`, id);
        }


        const { id, parent_id } = await this.getCategoryDetails(category);

        if (parent_id) {
            // 有父分类，证明为子分类，直接查询并返回结果
            const result = await query(id);

            return !!result;
        } else {
            // 没有父分类

            const childList = await this.getChildCategory(id);
            // 检查是否含有子分类

            if (childList.length > 0) return true;
            // 有子分类，返回true

            const result = await query(id);
            // 没有子分类，直接查询并返回

            return !!result;
        }
    }

    static async getCategoryDetails(name) {
        const query = (typeof name === "number") ? "id" : "name";
        return await AppDAO.get(`
            SELECT id, name, parent_id FROM categories WHERE ${query}=?
            ;`, [name]);
    }

    static async updateCategoryName(old_name, new_name) {
        return await AppDAO.run(`
        UPDATE categories SET name=? 
        WHERE name=?
        ;`, [
            new_name,
            old_name
        ]);
    }

    static async deleteCategory(category) {
        // 删除分类

        const del = (id) => {
            return AppDAO.run(`
            DELETE FROM categories WHERE id=?
            ;`, [id]);
        }

        const { id, parent_id } = await this.getCategoryDetails(category);
        if (!parent_id) {
            // 如果没有父分类，那么它可能是一个父分类，需要将子分类一同删除
            const child_id_list = await AppDAO.all(`
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

    static async getChildCategory(parent) {

        if (typeof parent === "string") {
            // 用分类名查询
            const { id } = await this.getCategoryDetails(parent);
            return await AppDAO.all(`
        SELECT id, name, parent_id FROM categories WHERE parent_id=?
        ;`, id);
        } else {
            // 用分类id查询
            return await AppDAO.all(`
        SELECT id, name, parent_id FROM categories WHERE parent_id=?
        ;`, parent);
        }
    }

    static async updateCategoryParent(name, parent_name) {
        const { id } = await this.getCategoryDetails(parent_name);
        return AppDAO.run(`
        UPDATE categories 
        SET parent_id=? 
        WHERE name=?
        ;`, [id, name]);
    }

    static async getCategoriesDetails() {
        return await AppDAO.all(`
        SELECT id, name, parent_id FROM categories
        ;`);
    }

}

export default CategoriesTask;