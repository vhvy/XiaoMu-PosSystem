import express from "express";
import promotion from "./promotion.js";

const route = express.Router();

route.use("/promotion", promotion);

export default route;