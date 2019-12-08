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

    await dao.run(`
    CREATE TABLE IF NOT EXISTS commodity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        pinyin TEXT,
        unit TEXT,
        size TEXT,
        vip_points BOOLEAN NOT NULL DEFAULT 1,
        in_price REAL DEFAULT 0 CHECK (in_price >= 0),
        sale_price REAL DEFAULT 0 CHECK (sale_price >= 0),
        count REAL DEFAULT 0,
        work_date INTEGER NOT NULL,
        change_date INTERGER NOT NULL,
        is_delete BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )
    ;`);

    await dao.run(`
    CREATE TABLE IF NOT EXISTS custom_barcode (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    ;`);

    await dao.run(`
    CREATE TABLE IF NOT EXISTS commodity_snapshot (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        create_time INTERGER NOT NULL,
        commodity_id INTEGER NOT NULL,
        barcode TEXT NOT NULL,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        pinyin TEXT,
        unit TEXT,
        size TEXT,
        vip_points BOOLEAN NOT NULL DEFAULT 1,
        in_price REAL DEFAULT 0 CHECK (in_price >= 0),
        sale_price REAL DEFAULT 0 CHECK (sale_price >= 0),
        work_date INTEGER NOT NULL,
        change_date INTERGER NOT NULL,
        is_delete BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (commodity_ID) REFERENCES commodity 
        (id)
    )
    ;`);

    AppDAO.close();
}

init();