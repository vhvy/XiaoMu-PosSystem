export class CategoriesTask {
    static getCategoriesTree(ajax) {
        return ajax.get("/api/warehouse/categories");
    }

    static updateCategoryName(ajax, old_name, new_name) {
        return ajax.put("/api/warehouse/categories/updatename", {
            old_name,
            new_name
        });
    }

    static deleteCategory(ajax, name) {
        return ajax.delete(`/api/warehouse/categories/delete/${encodeURIComponent(name)}`)
    }

    static createCategory(ajax, name) {
        return ajax.post("/api/warehouse/categories/create", {
            name
        });
    }

    static createChildCategory(ajax, name, parent_name) {
        return ajax.post("/api/warehouse/categories/create", {
            name,
            parent_name
        });
    }

    static updateCategoryParent(ajax, name, parent_name) {
        return ajax.put("/api/warehouse/categories/updateparent", {
            name,
            parent_name
        });
    }
}