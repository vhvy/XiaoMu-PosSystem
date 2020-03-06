import express from "express";
import auth from "../middleware/auth.js";
import users from "./users.js";
import login from "./login.js";
import groups from "./groups.js";
import token from "./auth/token.js";

import warehouse from "./warehouse/index.js";
import vip from "./vip/index.js";
import front from "./front/index.js";
import market from "./market/index.js";
import admin from "../middleware/admin.js";
import data from "./data/index.js";
import statistics from "./statistics/index.js";

const route = express.Router();

route.use("/token", token);
route.use("/login", login);
route.use(auth);
route.use("/front", front);
route.use("/users", users);

route.use(admin);
route.use("/groups", groups);
route.use("/market", market);

route.use("/vip", vip);
route.use("/warehouse", warehouse);

route.use("/data", data);

route.use("/statistics", statistics);

export default route;