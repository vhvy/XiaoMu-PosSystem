import express from "express";
import { exportDataSchema } from "../../schema/data.js";
import { validBody } from "../../middleware/validBody.js";
import ExportDataTasks from "../../tasks/export_data.js";

const route = express.Router();

route.get("/", validBody(exportDataSchema, "参数错误!", false), async (req, res, next) => {
    // 导出数据

    const { type } = req.query;

    const result = await ExportDataTasks.exportData(type);

    res.json(result);
});

export default route;