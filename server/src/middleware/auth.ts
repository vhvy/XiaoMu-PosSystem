import { Middleware } from "@/decorator/use";

const auth: Middleware = async (ctx, next) => {
    return await next();
};

export default auth;