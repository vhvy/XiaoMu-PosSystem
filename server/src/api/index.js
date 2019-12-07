import express from "express";
import auth from "../middleware/auth.js";
import users from "./users.js";
import login from "./login.js";
import cash from "./cash.js";
import groups from "./groups.js";

import warehouse from "./warehouse/index.js";

const route = express.Router();

route.use("/login", login);
route.use(auth);
route.use("/users", users);
route.use("/groups", groups);
route.use("/cash", cash);

route.use("/warehouse", warehouse);

export default route;