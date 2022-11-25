import type { SequelizeOptions } from "sequelize-typescript";

interface DataBaseConfig extends SequelizeOptions {
    tablePrefix: string
}

const config: DataBaseConfig = {
    database: "test",
    dialect: "mysql",
    username: "root",
    password: "123456",
    tablePrefix: "xm_"
};

export default config;