import { controller } from "@/decorator/controller";
import { post } from "@/decorator/request";
import { unifyUse } from "@/decorator/use";
import validate from "@/decorator/validate";
import auth from "@/middleware/auth";
import UserServices from "@/services/user/UserServices";
import { Controller } from "@/types/controller";
import { userLoginSchema } from "@/validator/user/user";
import type { RouterContext } from "@koa/router";

type MethodName = "handleLogin";

@controller("/user")
@unifyUse<MethodName>(auth, ["handleLogin"])
export class UserController implements Controller<MethodName> {

    @validate(userLoginSchema)
    @post("/login")
    async handleLogin(ctx: RouterContext) {
        const { account, password } = ctx.request.body as {
            account: string,
            password: string
        };
        
        return UserServices.handleLogin(account, password);
    }
}