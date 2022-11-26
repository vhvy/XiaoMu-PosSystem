import type { RouterContext as KoaRouterContext } from "@koa/router";
import { TokenUserInfo } from "./user";

export interface AuthRouterCtx extends KoaRouterContext {
    userInfo: TokenUserInfo
};