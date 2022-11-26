import jwt, { JwtPayload } from "jsonwebtoken";
import { tokenSecretKey, tokenExpiresIn } from "@/config/index";

export const createToken = (content: jwt.JwtPayload) => {
    return jwt.sign(content, tokenSecretKey, {
        expiresIn: tokenExpiresIn,
    })
}


type VerifyStatus = [true, string | JwtPayload] | [false, string];

export const verifyToken = (token: string) => {
    return new Promise<VerifyStatus>((resolve) => {
        return jwt.verify(token, tokenSecretKey, (err, decoded) => {
            if (err) {
                const errMsg = err.name === "TokenExpiredError" ? "凭证已过期!" : "鉴权失败!";
                resolve([false, errMsg]);
            } else if (!decoded) {
                resolve([false, "鉴权失败!"]);
            } else {
                resolve([true, decoded]);
            }
        });
    });
}