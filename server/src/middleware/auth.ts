import Expection from "@/base/exception";
import { tokenHeaderKey } from "@/config";
import { Middleware } from "@/decorator/use";
import { verifyToken } from "@/utils/jwt";


const auth: Middleware = async (ctx, next) => {

    let token = ctx.header[tokenHeaderKey.toLowerCase()]?.toString();

    if (!token) throw new Expection("找不到Token！", 401);
    token = token.split("Bearer ")[1];
    if (!token) throw new Expection("找不到Token！", 401);

    const [status, result] = await verifyToken(token);

    if (!status) throw new Expection(result, 401);

    ctx.userInfo = result;

    return await next();
};

export default auth;