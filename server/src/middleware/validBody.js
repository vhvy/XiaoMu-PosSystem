import { throwError } from "./handleError.js";

function validBody(schema, errMessage) {
    return function (req, res, next) {
        const { body } = req;
        const validateResult = schema.validate(body);
        if (validateResult.error) {
            return throwError(next, errMessage);
        }
        next();
    }
}

export {
    validBody
};