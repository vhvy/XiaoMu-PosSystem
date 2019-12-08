import express from "express";
import categories from "./categories.js";
import commodity from "./commodity.js";

const route = express.Router();

route.use("/categories", categories);
route.use("/commodity", commodity);

export default route;