import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { throwError } from "../../middleware/handleError.js";
import SuppliersTask from "../../tasks/suppliers.js";
import {
    createSupplierSchema,
    updateSupplierSchema,
    deleteSupplierSchema
} from "../../schema/suppliers.js";
import config from "../../config/index.js";

const { default_supplier } = config;

const route = express.Router();

route.get("/", async (req, res) => {
    // 获取所有的供应商信息

    const result = await SuppliersTask.getSupplierDetails();

    res.json(result);
});

route.post("/create", validBody(
    createSupplierSchema,
    "请输入正确的供应商信息!"
), async (req, res, next) => {
    // 建立新的供应商信息

    const { name, phone, description } = req.body;

    const querySupplierNameResult = await SuppliersTask.getSupplierDetails(name);
    if (querySupplierNameResult) {
        return throwError(next, "此供货商名称已存在!");
    }

    await SuppliersTask.createSupplier(name, phone, description);

    res.json({
        name,
        phone,
        description
    });
});

route.put("/update", validBody(
    updateSupplierSchema,
    "请输入正确的供货商信息!"
), async (req, res, next) => {
    // 修改供货商信息
    const { name, update_value } = req.body;

    if (name === default_supplier) return throwError(next, "不能修改默认供货商!")

    const querySupplierNameResult = await SuppliersTask.getSupplierDetails(name);
    if (!querySupplierNameResult) {
        return throwError(next, "此供货商不存在,无法更新!");
    }
    // 当修改的供货商不存在时返回400

    const { new_name, new_phone, new_description } = update_value;

    if (new_name) {
        const queryNewSupplierNameResult = await SuppliersTask.getSupplierDetails(new_name);
        if (queryNewSupplierNameResult) {
            return throwError(next, "此供货商已存在!");
        }
        // 当新的供货商名字存在时返回400
    }

    await SuppliersTask.updateSupplier({
        name, new_name, new_phone, new_description
    });

    res.json({
        name, new_name, new_phone, new_description
    });

});

route.delete("/delete", validBody(
    deleteSupplierSchema,
    "请输入正确的供货商名称!"
), async (req, res, next) => {
    // 删除供货商

    const { name } = req.body;

    if (name === default_supplier) return throwError(next, "不能删除默认供货商!")

    const querySupplierResult = await SuppliersTask.getSupplierDetails(name);
    if (!querySupplierResult) {
        return throwError(next, "供货商不存在!");
    }
    // 当供货商不存在时返回400

    const quertSupplierIsUseResult = await SuppliersTask.checkSupplierIsUse(name);
    if (quertSupplierIsUseResult) {
        return throwError(next, "供货商已被使用，无法删除!");
    }
    // 当供货商已被商品使用时返回400

    await SuppliersTask.deleteSupplier(name);

    res.json({
        message: "删除成功!",
        name
    })
});


export default route;