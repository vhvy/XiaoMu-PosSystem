const allowMethod = ["GET"];

export function preventModify(req, res, next) {
    // 阻止所有的修改操作

    if (allowMethod.includes(req.method)) {
        return next();
    }

    res.status(400).json({
        message: "demo模式下无法进行此操作!"
    });
}

export default preventModify;