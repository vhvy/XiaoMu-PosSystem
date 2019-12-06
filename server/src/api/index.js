import express from "express";
import users from "./users.js";
import login from "./login.js";
import cash from "./cash.js";
import groups from "./groups.js";
import auth from "../middleware/auth.js";

const route = express.Router();

route.use("/login", login);
route.use(auth);
route.use("/users", users);
route.use("/groups", groups);
route.use("/cash", cash);

export default route;