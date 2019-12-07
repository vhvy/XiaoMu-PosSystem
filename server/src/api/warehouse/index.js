import express from "express";
import categories from "./categories.js";

const route = express.Router();

route.use("/categories", categories);

export default route;