import AppDAO from "../src/data/AppDAO.js";
import moduleList from "../config/moduleList.js";
import { genHash } from "../src/lib/encryptPwd.js";
import GroupTask from "../src/tasks/groups.js";
import UserTask from "../src/tasks/users.js";
import config from "../src/config/index.js";

const { default_admin_group_name, default_supplier } = config;

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
        change_date INTEGER NOT NULL,
        is_delete BOOLEAN NOT NULL DEFAULT 0,
        supplier_id INTEGER NOT NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )
    ;`);
    // 创建商品表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS custom_barcode (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    ;`);
    // 创建自定义条码占位表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS commodity_snapshot (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        create_time INTEGER NOT NULL,
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
        change_date INTEGER NOT NULL,
        is_delete BOOLEAN NOT NULL DEFAULT 0,
        supplier_id INTEGER NOT NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (commodity_ID) REFERENCES commodity 
        (id)
    )
    ;`);
    // 创建商品历史信息表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        phone TEXT,
        description TEXT
    )
    ;`);
    // 创建供货商信息表

    await dao.run(`
    INSERT INTO suppliers 
    (name, phone, description) 
    VALUES (?, ?, ?)
    ;`, [default_supplier, "", "默认供应商"]);
    // 创建默认供货商

    await dao.run(`
    CREATE TABLE IF NOT EXISTS vip_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )
    ;`);
    // 创建会员卡类型表

    await dao.run(`
    INSERT INTO vip_type 
    (name) 
    VALUES (?)
    ;`, ["积分卡"]);
    // 创建积分卡类型

    await dao.run(`
    CREATE TABLE IF NOT EXISTS vip_score_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        money INTEGER NOT NULL DEFAULT 1 CHECK (money >= 1),
        scale INTEGER NOT NULL DEFAULT 1 CHECK (scale >= 1)
    )
    ;`);
    // 创建积分卡规则表，设置每多少元消费等于多少积分

    await dao.run(`
    CREATE TABLE IF NOT EXISTS vip_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        type_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        sex TEXT,
        phone TEXT,
        pinyin TEXT,
        create_date INTEGER NOT NULL,
        change_date INTEGER NOT NULL,
        is_disable BOOLEAN NOT NULL DEFAULT 0,
        work_type TEXT NOT NULL DEFAULT "办理" CHECK (work_type="办理" OR work_type="补换卡"),
        FOREIGN KEY (type_id) REFERENCES vip_type (id)
    )
    ;`);
    // 创建会员列表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS vip_info_snapshot (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vip_member_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        type_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        sex TEXT,
        phone TEXT,
        pinyin TEXT,
        create_date INTEGER NOT NULL,
        change_date INTEGER NOT NULL,
        is_disable BOOLEAN NOT NULL DEFAULT 0,
        work_type TEXT NOT NULL DEFAULT "办理" CHECK (work_type="办理" OR work_type="补换卡"),
        FOREIGN KEY (vip_member_id) REFERENCES vip_info (id)
    )
    ;`);
    // 创建会员信息快照列表

    await dao.run(`
    CREATE TABLE IF NOT EXISTS vip_value (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vip_id INTEGER NOT NULL UNIQUE,
        vip_sum INTEGER NOT NULL DEFAULT 0,
        sale_sum INTEGER NOT NULL DEFAULT 0,
        consume_count INTEGER DEFAULT 0,
        FOREIGN KEY (vip_id) REFERENCES vip_info (id)
    )
    ;`);
    // 记录会员积分等信息

    await dao.run(`
    CREATE TABLE IF NOT EXISTS vip_change (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        old_code_id INTEGER NOT NULL UNIQUE,
        new_code_id INTEGER NOT NULL UNIQUE,
        change_date INTERGER NOT NULL,
        description TEXT,
        FOREIGN KEY (old_code_id) REFERENCES vip_info (id),
        FOREIGN KEY (new_code_id) REFERENCES vip_info (id)
    )
    ;`);

    AppDAO.close();
}

init();