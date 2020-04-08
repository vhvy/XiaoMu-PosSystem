import path from "path";

const db_path = path.resolve("./", "db/data.db");

const common = {
    port: 8888,
    db_path,
    default_admin_group_name: "管理员组",
    default_pos_group_name: "收银员组",
    default_supplier: "默认供货商",
    default_all_category: "TREE_BASE",
    default_admin_username: "admin",
    default_admin_password: "password",
    default_pos_username: "pos",
    default_pos_password: "password"
}

export default common;