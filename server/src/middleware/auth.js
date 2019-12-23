import Jwt from "../lib/jwt.js";

export function validToken(token) {
    return Jwt.verify(token);
}

async function auth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({
            message: "无验证信息，请登录!"
        });
    }
    try {
        const result = await validToken(token);
        req["jwt_value"] = result;
        next();
    } catch (error) {
        const err = new Error("验证失败，请重新登录!");
        err.status = 401;
        next(err);
    }
}

export default auth;