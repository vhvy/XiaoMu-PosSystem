import express from "express";
import admin, { validateAdmin } from "../middleware/admin.js";
import UsersTask from "../tasks/users.js";
import GroupTask from "../tasks/groups.js";
import {
    newUserSchema,
    updateUserPwdSchema,
    updateUserStatusSchema,
    updateUserNameSchema,
    updateUserGroupSchema
} from "../schema/user.js";
import { genHash } from "../lib/encryptPwd.js";
import { throwError } from "../middleware/handleError.js";
import { validBody } from "../middleware/validBody.js";

const route = express.Router();

route.put("/updatepwd", validBody(
    updateUserPwdSchema,
    "请输入正确的用户名和密码!"
), async (req, res, next) => {
    // 修改用户密码

    const { body, jwt_value } = req;

    const { username, new_password } = body;
    const isAdmin = await validateAdmin(jwt_value.username);
    if (jwt_value.username !== username && !isAdmin) {
        return throwError(next, "没有权限!", 403);
    }
    // 如果用户不是管理员，修改别的用户密码时返回403

    const queryUserResult = await UsersTask.getUserDetails(username);
    if (!queryUserResult) {
        return throwError(next, "此用户不存在!");
    }
    // 如果被修改密码的用户不存在返回400

    const hash = await genHash(new_password);
    await UsersTask.changeUserPwd(username, hash);
    res.json({
        message: "修改成功!",
        username
    });
});

route.use(admin);

route.get("/", async (req, res) => {
    // 获取所有的用户信息;

    const result = await UsersTask.getAllUser();
    res.send(result);
});

route.put("/updateusergroup", validBody(
    updateUserGroupSchema,
    "请输入正确的信息!"
), async (req, res, next) => {
    // 修改用户所属的用户组

    const { username, new_group } = req.body;

    const queryUserResult = await UsersTask.validateUsername(username);
    if (!queryUserResult) {
        return throwError(next, "此用户不存在!");
    }
    // 当用户名不存在时返回400

    const queryGroupResult = await GroupTask.getGroupDetails(new_group);
    if (!queryGroupResult) {
        return throwError(next, "此用户组不存在!");
    }
    // 当用户组不存在时返回400

    await UsersTask.changeUserGroup(username, new_group);

    res.json({
        message: "修改成功!",
        username,
        new_group
    });
});

route.post("/updateusername", validBody(
    updateUserNameSchema,
    "请输入正确的用户名!"
), async (req, res, next) => {
    // 修改用户名

    const { old_username, new_username } = req.body;


    const queryOldUserResult = await UsersTask.validateUsername(old_username);
    if (!queryOldUserResult) {
        return throwError(
            next,
            "此账户不存在，无法修改!");
    }
    // 如果被修改用户名的用户不存在返回400

    const queryNewUserResult = await UsersTask.validateUsername(new_username);
    if (queryNewUserResult) {
        return throwError(next, "此账户已存在，无法修改!");
    }
    // 如果新的用户名已存在返回400

    await UsersTask.changeUserName(old_username, new_username);

    res.json({
        message: "修改成功!",
        old_username,
        new_username
    });
})

route.post("/createuser", validBody(
    newUserSchema,
    "请输入正确的信息!"
), async (req, res, next) => {
    // 创建新用户

    const { new_username, password, group } = req.body;

    const queryUserResult = await UsersTask.validateUsername(new_username);
    if (queryUserResult) {
        return throwError(next, "此账户已存在!");
    }
    // 当用户名已存在时返回400

    const queryGroupResult = await GroupTask.getGroupDetails(group);
    if (!queryGroupResult) {
        return throwError(next, "此用户组不存在!");
    }
    // 当用户组不存在时返回400

    const hash = await genHash(password);
    await UsersTask.createUser(new_username, hash, queryGroupResult.id);

    const result = await UsersTask.getUserDetails(new_username);

    res.json(result);
});

route.put("/updateuserstatus", validBody(
    updateUserStatusSchema,
    "请输入正确的信息组合!"
), async (req, res, next) => {
    // 设置用户是否被禁用

    const { username, status } = req.body;

    if (username === req["jwt_value"].username) {
        return throwError(next, "无法禁用当前登录用户!");
    }


    const queryUserResult = await UsersTask.validateUsername(username);
    if (!queryUserResult) {
        return throwError(next, "此用户不存在!"
        );
    }
    // 当用户不存在时返回400

    await UsersTask.updateUserStatus(username, status);
    res.json({
        message: "修改成功!"
    })
});

export default route;