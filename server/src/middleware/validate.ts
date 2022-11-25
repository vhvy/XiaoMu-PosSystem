import Expection from "@/base/exception";
import { RequestMethod } from "@/decorator/request";
import { Middleware } from "@/decorator/use";
import type { ObjectSchema } from "joi";


const createValidate = (schemaList: ObjectSchema[], method: RequestMethod): Middleware => {
    return async (ctx, next) => {
        let data;
        switch (method) {
            case RequestMethod.GET:
            case RequestMethod.DELETE:
                data = ctx.query;
                break;
            case RequestMethod.POST:
            case RequestMethod.PUT:
                data = ctx.request.body;
                break;
        }
        for (let schema of schemaList) {
            const res = schema.validate(data);
            if (res.error) {
                throw new Expection(res.error.message, 400);
            }
        }
        return await next();
    }
}

export default createValidate;