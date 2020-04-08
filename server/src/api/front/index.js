import express from "express";
import commodity from "./commodity.js";
import vip_member from "./vip_member.js";
import order from "./order.js";

const route = express.Router();

route.use("/commodity", commodity);
route.use("/vip", vip_member);
route.use("/order", order);

export default route;