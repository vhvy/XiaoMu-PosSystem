import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const controllerDirUrlInfo = new URL("../controllers", import.meta.url);
const controllerDirPath = url.fileURLToPath(controllerDirUrlInfo);


const importController = (dirPath: string) => {
    const list = fs.readdirSync(dirPath);
    list.forEach(item => {
        const fullPath = path.resolve(dirPath, item);
        const info = fs.lstatSync(fullPath);
        if (info.isFile()) {
            // 控制器
            const fileUrl = url.pathToFileURL(fullPath);
            import(fileUrl.href);
        } else if (info.isDirectory()) {
            // 文件夹
            importController(fullPath);
        }
    });
};


importController(controllerDirPath);