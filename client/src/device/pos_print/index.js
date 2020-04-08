export { PosPrintConfig } from "./config";

export class PosPrint {

    static async print(data) {
        console.log("[设备]小票打印机: ", data);
    }
}