import { throwError } from "./handleError.js";

function validBody(schema, errMessage) {
    return function (req, res, next) {
        const validateResult = schema.validate(req.body);
        if (validateResult.error) {
            // console.log(validateResult.error.details[0].message);
            const message = errMessage ? errMessage : validateResult.error.details[0].message;
            return throwError(next, message);
        }
        next();
    }
}

export {
    validBody
};