import { METHOD_KEY, PATH_KEY } from "@/constant/decorator";

export enum RequestMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
    ALL = "all"
}

const createRequestDecorator = (method: RequestMethod) => {
    return (path: string): MethodDecorator => {
        return (target, key) => {
            Reflect.defineMetadata(PATH_KEY, path, target, key);
            Reflect.defineMetadata(METHOD_KEY, method, target, key);
        };
    };
}

export const get = createRequestDecorator(RequestMethod.GET);
export const post = createRequestDecorator(RequestMethod.POST);
export const put = createRequestDecorator(RequestMethod.PUT);
export const del = createRequestDecorator(RequestMethod.DELETE);
export const all = createRequestDecorator(RequestMethod.ALL);