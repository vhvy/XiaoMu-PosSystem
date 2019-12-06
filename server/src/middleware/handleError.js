function handleError(err, req, res, next) {
    const { message, status } = err;
    res.status(status ? status : 400).json({
        message
    });
}

function throwError(next,
    message = "未知错误!",
    status = 400, ) {
    const err = new Error(message);
    err.status = status;
    return next(err);
}

export {
    throwError
};

export default handleError;