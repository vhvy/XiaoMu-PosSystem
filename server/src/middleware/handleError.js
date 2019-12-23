function handleError(err, req, res, next) {
    const { message, status } = err;

    let obj = {
        message
    };
    if (req.custom_error_data) {
        obj.value = req.custom_error_data;
    }
    res.status(status ? status : 400).json(obj);
}

function throwError(next,
    message = "未知错误!",
    status = 400) {
    const err = new Error(message);
    err.status = status;
    return next(err);
}

export {
    throwError
};

export default handleError;