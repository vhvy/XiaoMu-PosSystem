import Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next) => {
    try {
        console.log(123);
        await next();
    } catch (error) {
        console.log(error);
        ctx.throw(400, error.message);
    }
}