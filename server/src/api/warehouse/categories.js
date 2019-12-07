import express from "express";
import { throwError } from "../../middleware/handleError.js";
import { validBody } from "../../middleware/validBody.js";
import {
    createCategorySchema,
    updateCategoryNameSchema,
    updateCategoryParentSchema,
    deleteCategorySchema
} from "../../schema/categories.js";
import CategoriesTask from "../../tasks/categories.js";

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取所有商品分类

    const CategoriesManage = new CategoriesTask();
    const result = await CategoriesManage.getCategoriesDetails();
    let list = result.map(({ name, parent_id }) => {
        let obj = {
            name
        }
        if (parent_id) obj["parent_name"] = result.find(({ id }) => id === parent_id)["name"];

        return obj;
    });
    res.send(list);
});

route.post("/create", validBody(
    createCategorySchema,
    "提交的信息不正确!"
), async (req, res, next) => {
    // 创建商品分类

    const { name, parent_name } = req.body;
    const CategoriesManage = new CategoriesTask();

    const validCategoryResult = await CategoriesManage.getCategoryDetails(name);
    if (validCategoryResult) {
        return throwError(next, "此分类已存在!");
    }
    // 当新分类的名称存在时返回400

    if (parent_name) {
        const validParentCategoryResult = await CategoriesManage.getCategoryDetails(parent_name);
        if (!validParentCategoryResult) {
            return throwError(next, "父分类不存在!");
        }
        // 当父分类不存在时返回400

        if (validParentCategoryResult.parent_id) {
            return throwError(next, "提交的子分类是父父类，请重新选择!");
        }
        // 当提交的父分类拥有父分类的id时返回400

        await CategoriesManage.createCategory(name, parent_name);

        return res.json({
            message: "创建成功!",
            name,
            parent_name
        });
    }

    await CategoriesManage.createCategory(name);

    res.json({
        message: "创建成功!",
        name,
        parent_name
    });
});

route.post("/updatename", validBody(
    updateCategoryNameSchema,
    "请输入正确的信息!"
), async (req, res, next) => {
    // 更新分类名称

    const { old_name, new_name } = req.body;

    const CategoriesManage = new CategoriesTask();

    const validOldNameResult = await CategoriesManage.getCategoryDetails(old_name);
    if (!validOldNameResult) {
        return throwError(next, "需要修改的分类不存在!");
    }
    // 当需要修改的分类不存在时返回400

    const validNewNameResult = await CategoriesManage.getCategoryDetails(new_name);
    if (validNewNameResult) {
        return throwError(next, "新的分类名称已存在!");
    }
    // 当新的分类名称已存在时返回400

    await CategoriesManage.updateCategoryName(old_name, new_name);

    res.json({
        message: "修改成功!",
        old_name,
        new_name
    });
});

route.post("/updateparent", validBody(
    updateCategoryParentSchema,
    "请输入正确的分类名称!"
), async (req, res, next) => {
    // 更新子分类所属的父分类

    const { name, parent_name } = req.body;
    const CategoriesManage = new CategoriesTask();
    const validNameResult = await CategoriesManage.getCategoryDetails(name);
    if (!validNameResult) {
        return throwError(next, "需要修改的子分类不存在!");
    }
    // 当需要修改的子分类不存在时返回400


    const validChildResult = await CategoriesManage.getChildCategory(name);
    if (validChildResult.length !== 0) {
        return throwError(next, "提交的子分类是父分类，无法为父分类设置父分类!");
    }
    // 当需要修改的子分类已是父分类时返回400

    const validParentNameResult = await CategoriesManage.getCategoryDetails(parent_name);
    if (!validParentNameResult) {
        return throwError(next, "此父分类不存在!");
    }
    // 当父分类不存在时返回400

    const { parent_id } = await CategoriesManage.getCategoryDetails(parent_name);
    if (parent_id) {
        return throwError(next, "提交的父分类是子分类，无法将其设置为父分类!");
    }
    // 当需要修改的父分类是子分类时返回400



    await CategoriesManage.updateCategoryParent(name, parent_name);

    res.json({
        message: "修改成功!",
        name,
        parent_name
    });
});

route.post("/delete", validBody(
    deleteCategorySchema, "请输入正确的分类名!"
), async (req, res, next) => {
    // 删除分类

    const { name } = req.body;
    const CategoriesManage = new CategoriesTask();
    const validCategoryResult = await CategoriesManage.getCategoryDetails(name);
    if (!validCategoryResult) {
        return throwError(next, "分类不存在!");
    }

    const { id } = validCategoryResult;
    function validCategoryHasCommodity(id) {
        // 检查当前分类下是否含有商品
        // 待完成商品分类后再修改此处

        return false;
    }

    if (validCategoryHasCommodity(id)) {
        return throwError(next, "当前分类下含有商品,无法删除!");
    }

    await CategoriesManage.deleteCategory(id);

    res.json({
        message: "删除成功!",
        name
    });

});



export default route;