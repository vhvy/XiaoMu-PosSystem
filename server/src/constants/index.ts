export enum HttpMethod {
    get = "get",
    post = "post",
    put = "put",
    delete = "delete",
    options = "options"
}

export enum ControllerKey {
    PATH = "path",
    METHOD = "method"
};

export enum MetaKey {
    CONSTRUCT = "constructor",
    MIDDLEWARE = "middleware"
};

export enum MiddlewareKey {
    AUTH = "auth",
    HANDLE_ERROR = "handleError",
    CORS = "CORS",
}