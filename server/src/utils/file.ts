import fs from "node:fs";
import path from "node:path";
import url from "node:url";


/**
 * 获取文件夹下所有文件路径
 * @param _dirPath 文件夹路径
 * @returns string[]
 */
export const getAllFilePath = (_dirPath: string) => {
    const filePathList: string[] = [];

    const load = (dirPath: string) => {
        const list = fs.readdirSync(dirPath);

        list.forEach(item => {
            const fullPath = path.resolve(dirPath, item);
            const info = fs.lstatSync(fullPath);
            if (info.isFile()) {
                // 普通文件
                filePathList.push(url.pathToFileURL(fullPath).toString());
            } else if (info.isDirectory()) {
                load(fullPath);
            }
        });
    }

    load(_dirPath);

    return filePathList;
}