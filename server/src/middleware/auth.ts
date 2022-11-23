import { Middleware } from "@/decorator/use";

const auth: Middleware = async (ctx, next) => {
    await next();
};

export default auth;