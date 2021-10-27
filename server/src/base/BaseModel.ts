import config from "@/config/index";
import DbClient from "ali-mysql-client";

const { dbConfig } = config;

export default abstract class BaseModel {
    protected db: DbClient;
    constructor() {
        this.db = new DbClient(dbConfig);
    }

    public getAllUser() {
        return this.db
            .select("*")
            .from("xm_admin")
            .queryList();
    }
}