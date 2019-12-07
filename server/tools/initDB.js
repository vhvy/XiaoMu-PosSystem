import AppDAO from "../src/data/AppDAO.js";
import moduleList from "../config/moduleList.js";
import { genHash } from "../src/lib/encryptPwd.js";
import GroupTask from "../src/tasks/groups.js";
import UserTask from "../src/tasks/users.js";
import config from "../src/config/index.js";

const { default_admin_group_name } = config;

async function init() {
    const dao = AppDAO;
    await dao.run(`
    CREATE TABLE IF NOT EXISTS groups(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usergroup TEXT UNIQUE NOT NULL
    );
    `);
    // 创建用户组列表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        group_id INTEGER NOT NULL,
        disabled BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (group_id) REFERENCES groups (id)
    );
    `);
    // 创建用户列表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS authority(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        authority TEXT UNIQUE NOT NULL
    );
    `);
    // 创建权限列表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS groups_authority(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usergroup_id INTEGER NOT NULL,
        authority_id INTEGER NOT NULL,
        FOREIGN KEY (usergroup_id) REFERENCES groups (id),
        FOREIGN KEY (authority_id) REFERENCES authority (id)
    );
    `);
    // 创建用户组-权限一对一列表

    await Promise.all(
        moduleList.map(item =>
            dao.run(`
        INSERT INTO authority (authority) VALUES ("${item}")
        ;`)
        )
    );
    // 填充权限表


    const GroupManage = new GroupTask();
    const authorityIDList = (await dao.all(`
    SELECT id FROM authority
    ;`)).map(({ id }) => id);
    console.log(authorityIDList);
    await GroupManage.createGroup(default_admin_group_name, authorityIDList);
    // 创建默认管理员群组
    // 填充默认管理员群组权限

    const hash = await genHash("password");
    const { id: group_id } = await dao.get(`
    SELECT id FROM groups WHERE usergroup="${default_admin_group_name}"
    ;`);
    const UserManage = new UserTask();
    await UserManage.createUser("admin", hash, group_id);
    // 创建默认管理员


    await dao.run(`
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        parent_id INTEGER
    )
    ;`);
    // 创建商品分类表

    AppDAO.close();
}

init();