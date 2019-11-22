import express from "express";
import users from "./users.js";
import login from "./login.js";

const route = express.Router();

route.use("/users", users);
route.use("/login", login);

export default route;