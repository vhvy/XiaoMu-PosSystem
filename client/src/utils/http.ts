import config from "@/config";

enum HTTP_METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

const ALLOW_BODY_METHOD = [
    HTTP_METHOD.POST,
    HTTP_METHOD.PUT
];


type UrlQuery = Record<string, any> | undefined;

type RequestBody = object | FormData | string | undefined;

interface HttpConfig {
    timeout?: number,
    requireAuth?: boolean
};

const request = async (
    method: HTTP_METHOD = HTTP_METHOD.GET,
    path: string,
    query?: UrlQuery,
    body?: RequestBody,
    httpConfig: HttpConfig = {
        timeout: config.TIMEOUT,
        requireAuth: true
    }
) => {

    let url = config.BASE_URL + config.BASE_API_PREFIX + path;

    if (query) {
        const urlQuery = new URLSearchParams(query);
        url += "?" + urlQuery.toString();
    }

    const headers = new Headers();

    if (httpConfig.requireAuth) {
        const token = "Bearer ";

        headers.set("Authorization", token);
    }


    const fetchConfig: RequestInit = {
        method,
        headers
    };

    if (body && ALLOW_BODY_METHOD.includes(method)) {
        if (body instanceof FormData) {
        } else if (typeof body === "object") {
            body = JSON.stringify(body);
        }
        fetchConfig.body = body;
    }

    const abortController = new AbortController();

    const timerFlag = setTimeout(() => {
        abortController.abort();
    }, httpConfig.timeout);

    try {
        const response = await fetch(url, fetchConfig);
        clearTimeout(timerFlag);
        const result = await response.json();

        return result;
    } catch (err: any) {
        return err;
    }

}

const get = (path: string, query?: UrlQuery, httpConfig?: HttpConfig) => request(HTTP_METHOD.GET, path, query, undefined, httpConfig);
const post = (path: string, body?: RequestBody, httpConfig?: HttpConfig) => request(HTTP_METHOD.POST, path, undefined, body, httpConfig);
const put = (path: string, body?: RequestBody, httpConfig?: HttpConfig) => request(HTTP_METHOD.PUT, path, undefined, body, httpConfig);
const del = (path: string, query?: UrlQuery, httpConfig?: HttpConfig) => request(HTTP_METHOD.DELETE, path, query, undefined, httpConfig);

export default {
    get,
    post,
    put,
    del
}