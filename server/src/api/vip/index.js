import express from "express";
import members from "./members.js";

const route = express.Router();

route.use("/members", members);

export default route;