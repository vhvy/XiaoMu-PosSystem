import path from "path";

const db_path = path.resolve("./", "db/data.db");

export default {
    port: 8888,
    db_path,
    default_admin_group_name: "管理员",
    default_supplier: "默认供货商"
};