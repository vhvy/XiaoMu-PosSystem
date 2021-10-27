import BaseController, { KoaCtx, KoaNext } from "@/base/BaseController";
import { get, auth, post, prefix } from "@/decorator/controller";
import UserService from "@/app/services/User";

@auth
@prefix()
export class TestController extends BaseController {
    constructor(ctx: KoaCtx, next: KoaNext) {
        super(ctx, next);
    }

    @get("/test")
    async test() {
        console.log(this.ctx.state);
        this.success("daw");
    }

    @post("/balala")
    async balala() {
        console.log(this.ctx.headers.authorization);
        await UserService.query();
        this.success("666");
    }
}