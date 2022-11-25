import { getAllFilePath } from "@/utils/file";
import url from "node:url";
import router from "@/router/router";
import { OtherController } from "@/controllers/other";

const controllerDirUrlInfo = new URL("../controllers", import.meta.url);
const controllerDirPath = url.fileURLToPath(controllerDirUrlInfo);


const importController = (dirPath: string) => {
    const controllerList = getAllFilePath(dirPath);
    return controllerList.map(path => import(path));
};

const task = importController(controllerDirPath);

await Promise.all(task);

router.all("(.*)", OtherController.prototype.notFound);