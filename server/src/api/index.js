import express from "express";
import users from "./users.js";
import login from "./login.js";
import cash from "./cash.js";

const route = express.Router();

route.use("/login", login);
route.use("/users", users);
route.use("/cash", cash);

export default route;