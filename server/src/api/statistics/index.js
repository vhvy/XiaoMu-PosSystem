import express from "express";
import orders from "./orders.js";

const route = express.Router();

route.use("/orders", orders);

export default route;