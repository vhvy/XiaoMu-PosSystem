import path from "path";

const db_path = path.resolve("./", "db/data.db");

const common = {
    port: 8888,
    db_path,
    default_admin_group_name: "管理员",
    default_supplier: "默认供货商",
    default_all_category: "TREE_BASE"
}

export default common;