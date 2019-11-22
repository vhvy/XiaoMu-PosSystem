import path from "path";

const db_path = path.resolve("./", "db/data.db");

export default {
    port: 8888,
    db_path,
    authority: [
        {
            name: "仓储管理",
            read: true,
            write: true
        },
        {
            name: "前台销售",
            read: true,
            write: true
        }
    ]
};