import Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.state.user = "dwa";
    await next();
}