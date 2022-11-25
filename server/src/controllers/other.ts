import Expection from "@/base/exception";

export class OtherController {

    async notFound() {
        throw new Expection("找不到此路由!", 404);
    }
}