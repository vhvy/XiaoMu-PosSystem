import config from "../config/index.js";
import UserTask from "../tasks/users.js";

const { default_admin_group_name } = config;

async function validateAdmin(username) {
    const { group } = await (new UserTask()).getUserGroup(username);
    return group === default_admin_group_name;
}

async function admin(req, res, next) {
    const { username } = req.jwt_value;
    const result = await validateAdmin(username);
    if (result) {
        next();
    } else {
        const err = new Error("此账户没有权限执行这项操作!");
        err.status = 403;
        next(err);
    }
}

export {
    validateAdmin
}

export default admin;