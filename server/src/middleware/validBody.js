import { throwError } from "./handleError.js";

function validBody(schema, errMessage, key = "body") {
    return function (req, res, next) {
        const data = req[key];
        const validateResult = schema.validate(data);
        if (validateResult.error) {
            const message = errMessage ? errMessage : validateResult.error;
            return throwError(next, message);
        }
        next();
    }
}

export {
    validBody
};