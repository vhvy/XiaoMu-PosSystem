import express from "express";
import auth from "../middleware/auth.js";
import users from "./users.js";
import login from "./login.js";
import groups from "./groups.js";

import warehouse from "./warehouse/index.js";
import vip from "./vip/index.js";
import front from "./front/index.js";

const route = express.Router();

route.use("/login", login);
route.use(auth);
route.use("/front", front);
route.use("/users", users);
route.use("/groups", groups);

route.use("/vip", vip);
route.use("/warehouse", warehouse);

export default route;