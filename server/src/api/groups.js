import express from "express";
import admin from "../middleware/admin.js";
import { throwError } from "../middleware/handleError.js";
import GroupTask from "../tasks/groups.js";
import AuthorityTask from "../tasks/authority.js";
import {
    createGroupSchema,
    updateGroupNameSchema,
    updateGroupAuthoritySchema
} from "../schema/group.js";
import config from "../config/index.js";
import { validBody } from "../middleware/validBody.js";

const { default_admin_group_name } = config;

const route = express.Router();

route.use(admin);

route.get("/", async (req, res) => {
    // 获取所有用户组以及权限详情

    const GroupManage = new GroupTask();
    const queryGroupsResult = await GroupManage.getAllGroup();
    res.json(queryGroupsResult);
});

route.post("/create", validBody(
    createGroupSchema,
    "输入值不正确!"
), async (req, res, next) => {
    // 创建一个新的用户组

    const { name, authority } = req.body;
    const GroupManage = new GroupTask();
    const queryGroupsResult = await GroupManage.getGroupDetails(name);
    if (queryGroupsResult) {
        return throwError(next, "此用户组已存在!");
    }
    // 当用户组已存在时返回400

    const AuthorityManage = new AuthorityTask();
    const authorityListDetails = await AuthorityManage.getAllAuthority();
    const authorityList = authorityListDetails.map(({ authority }) => authority);
    // 获取数据库内所有权限详情

    for (let i of authority) {
        if (!authorityList.includes(i)) {
            return throwError(next, "权限名不正确!");
        }
    }
    // 当权限不存在时返回400

    const new_group_authority = authority.map(
        item => (authorityListDetails.find(
            ({ authority }) => authority === item
        ))["id"]
    );
    // 整理出权限的id

    await GroupManage.createGroup(name, new_group_authority);

    res.json({
        message: "创建成功!",
        group: name,
        authority: new_group_authority
    });
});

route.post("/updatename", validBody(
    updateGroupNameSchema,
    "请输入正确的用户组名!"
), async (req, res, next) => {
    // 修改用户组名称

    const { name, new_name } = req.body;
    if (name === default_admin_group_name) {
        return throwError(next, "默认管理员组不能修改名称!");
    }
    // 默认管理员群组不能修改名称

    const GroupManage = new GroupTask();

    const queryOldGroupResult = await GroupManage.getGroupDetails(name);
    if (!queryOldGroupResult) {
        return throwError(next, "要修改的用户组不存在!");
    }
    // 被修改的用户组不存在时返回400

    const queryNewGroupResult = await GroupManage.getGroupDetails(new_name);
    if (queryNewGroupResult) {
        return throwError(next, "要修改的新名称已存在!");
    }
    // 新用户组名已存在时返回400

    await GroupManage.updateGroupName(name, new_name);
    res.json({
        message: "用户组名称修改成功!",
        name,
        new_name
    });
});

route.post("/updateauthority", validBody(
    updateGroupAuthoritySchema,
    "请输入正确的信息!"
), async (req, res, next) => {
    // 修改用户组权限

    const { name, new_authority } = req.body;
    if (name === default_admin_group_name) {
        return throwError(next, "默认管理员组不能修改权限!");
    }
    // 默认管理员群组不能修改权限

    const GroupManage = new GroupTask();

    const queryGroupResult = await GroupManage.getGroupDetails(name);
    if (!queryGroupResult) {
        return throwError(next, "要修改的用户组不存在!");
    }
    // 被修改的用户组不存在时返回400

    const AuthorityManage = new AuthorityTask();

    const validAuthority = await AuthorityManage.validateAuthority(new_authority);
    if (!validAuthority) {
        return throwError(next, "权限值为非法!");
    }
    // 要修改的权限为非法值时返回400

    const { id: group_id } = queryGroupResult;
    const new_authority_id_list = await AuthorityManage.mapAuthorityNameToID(new_authority);

    await GroupManage.updateGroupAuthority(group_id, new_authority_id_list);

    res.json({
        message: "修改成功!",
        group: name,
        authority: new_authority
    })
});


export default route;