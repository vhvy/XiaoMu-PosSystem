import express from "express";
import import_data from "./import_data.js";
import export_data from "./export_data.js";

const route = express.Router();

route.use("/import", import_data);
route.use("/export", export_data);


export default route;