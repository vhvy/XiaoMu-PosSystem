import { throwError } from "./handleError.js";

function validBody(schema, errMessage, isBody = true) {
    return function (req, res, next) {
        const content = req[isBody ? "body" : "query"];

        const validateResult = schema.validate(content);
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