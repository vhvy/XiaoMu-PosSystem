import express from "express";
import categories from "./categories.js";
import commodity from "./commodity.js";
import suppliers from "./suppliers.js";
import stock from "./stock.js";

const route = express.Router();

route.use("/suppliers", suppliers);
route.use("/categories", categories);
route.use("/commodity", commodity);
route.use("/stock", stock);

export default route;