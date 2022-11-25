import Expection from "@/base/exception";
import { Middleware } from "@/decorator/use";

const response: Middleware = async (ctx, next) => {

    ctx.header["content-type"] = "application/json";

    try {
        const result = await next();
        ctx.body = result;
        ctx.status = 200;
    } catch (error: any) {
        if (error instanceof Expection) {
            ctx.body = {
                message: error.message
            };
            ctx.status = error.status;
        } else {
            ctx.body = {
                message: error.message
            };
            ctx.status = 400;
        }
    }
};

export default response;