import { Sequelize } from "sequelize-typescript";
import config from "@/config/database";
import url, { URL } from "node:url";
import { getAllFilePath } from "@/utils/file";

const controllerDirUrlInfo = new URL("../model", import.meta.url);
const controllerDirPath = url.fileURLToPath(controllerDirUrlInfo);

const modelPathList = getAllFilePath(controllerDirPath);

const models = (await Promise
    .all(modelPathList.map(path => import(path))))
    .map(m => m.default);




const instance = new Sequelize({
    ...config,
    models,
    hooks: {
        beforeDefine(columns, model) {
            model.tableName = config.tablePrefix + model.tableName;
            model.createdAt = "created_at";
            model.updatedAt = "updated_at";
        }
    }
});