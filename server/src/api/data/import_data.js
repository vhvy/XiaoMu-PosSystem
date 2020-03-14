import express from "express";
import { validBody } from "../../middleware/validBody.js";
import { importCommpditySchema } from "../../schema/data.js";
import ImportCommodityManage from "../../tasks/import_data/commodity.js";

const route = express.Router();

route.post("/commodity", validBody(importCommpditySchema), async (req, res, next) => {

    const { rules, data } = req.body;

    const result = await ImportCommodityManage.importData(rules, data);

    res.json(result);
});

export default route;