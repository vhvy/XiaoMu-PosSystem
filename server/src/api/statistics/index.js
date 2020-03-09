import express from "express";
import orders from "./orders.js";
import proportion from "./proportion.js";

const route = express.Router();

route.use("/orders", orders);
route.use("/proportion", proportion);

export default route;