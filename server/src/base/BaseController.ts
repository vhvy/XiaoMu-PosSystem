import Koa from "koa";

export type KoaCtx = Koa.Context;
export type KoaNext = Koa.Next;

interface Controller {
    success: Function;
    fail: Function;
    ctx: KoaCtx;
    next: KoaNext;
};

export default abstract class BaseController implements Controller {
    ctx: KoaCtx;
    next: KoaNext
    constructor(ctx: KoaCtx, next: KoaNext) {
        this.ctx = ctx;
        this.next = next;
    }

    async success(msg: string) {
        this.ctx.body = msg;
        await this.next();
    }


    async fail() {
        await this.next();
    }
}