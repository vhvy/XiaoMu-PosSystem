import express from "express";
import { throwError } from "../../middleware/handleError.js";
import CommodityTask from "../../tasks/frontend/commodity.js";

const route = express.Router();

route.get("/:query", async (req, res, next) => {
    const { query } = req.params;

    const result = await CommodityTask.getCommodityDetails(query.toUpperCase());

    res.json(result);
})

export default route;