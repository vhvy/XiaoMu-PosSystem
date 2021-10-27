export interface DbConfig {
    host: string,
    user: string,
    password: string,
    database: string
};

interface Config {
    prefix: string,
    port: number,
    allowOriginHost: string[];
    dbConfig: DbConfig;
    [propName: string]: any;
};

const common: Config = {
    prefix: "/api",
    port: 3001,
    allowOriginHost: [
        "www.google.com"
    ],
    dbConfig: {
        host: "localhost",
        user: "root",
        password: "123456",
        database: "xm_pos_system"
    }
};

const isDev: boolean = process.env.NODE_ENV === "development";

const config: Config = {
    isDev,
    ...common
};

export default config;