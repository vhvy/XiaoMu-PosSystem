import { throwError } from "./handleError.js";

function validBody(schema, errMessage) {
    return function (req, res, next) {
        const validateResult = schema.validate(req.body);
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