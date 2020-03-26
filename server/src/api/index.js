import express from "express";
import auth from "../middleware/auth.js";
import today from "./today.js";
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

import store from "./store.js";

const route = express.Router();

const config = [
    {
        path: "/token",
        fn: token
        // 验证token合法性
    },
    {
        path: "/login",
        fn: login
        // 登录接口
    },
    {
        fn: auth
        // 路由守卫，此中间件以后的路由全部需要携带合法token
    },
    {
        path: "/front",
        fn: front
    },
    {
        path: "/users",
        fn: users
    },
    {
        path: "/today",
        fn: today
        // 当日销售的数据
    },
    {
        fn: admin
        // 路由守卫，此中间件以后的路由全部需要管理员权限
    },
    {
        path: "/groups",
        fn: groups
    },
    {
        path: "/market",
        fn: market
    },
    {
        path: "/vip",
        fn: vip
    },
    {
        path: "/warehouse",
        fn: warehouse
    },
    {
        path: "/data",
        fn: data
    },
    {
        path: "/statistics",
        fn: statistics
    },
    {
        path: "/store",
        fn: store
    }
];

for (let { path, fn } of config) {
    path ? route.use(path, fn) : route.use(fn);
}

export default route;