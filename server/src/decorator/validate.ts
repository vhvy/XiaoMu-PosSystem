import type { ObjectSchema } from "joi";
import { VALIDATE_KEY } from "@/constant/decorator";

function validate(schema: ObjectSchema): MethodDecorator;
function validate(schema: ObjectSchema[]): MethodDecorator;

function validate(schema: ObjectSchema | ObjectSchema[]): MethodDecorator {
    return (target, key) => {
        const validatorList: ObjectSchema[] = Reflect.getMetadata(VALIDATE_KEY, target, key) || [];

        if (Array.isArray(schema)) {
            validatorList.push(...schema);
        } else {
            validatorList.push(schema);
        }

        Reflect.defineMetadata(VALIDATE_KEY, validatorList, target, key);
    }
}

export default validate;