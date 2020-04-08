import express from "express";
import orders from "./orders.js";
import proportion from "./proportion.js";
import trends from "./trends.js";

const route = express.Router();

route.use("/orders", orders);
route.use("/proportion", proportion);
route.use("/trends", trends);

export default route;