import express from "express";
import promotion from "./promotion/index.js";

const route = express.Router();

route.use("/promotion", promotion);

export default route;