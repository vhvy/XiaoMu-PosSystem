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

export interface HttpConfig {
    timeout?: number,
    requireAuth?: boolean
};

const request = async <R>(
    method: HTTP_METHOD = HTTP_METHOD.GET,
    path: string,
    query?: UrlQuery,
    body?: any,
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


    const abortController = new AbortController();

    const fetchConfig: RequestInit = {
        method,
        headers,
        signal: abortController.signal
    };

    if (body && ALLOW_BODY_METHOD.includes(method)) {
        if (body instanceof FormData) {
        } else if (typeof body === "object") {
            body = JSON.stringify(body);
            headers.set("Content-Type", "application/json")
        }
        fetchConfig.body = body;
    }

    const timerFlag = setTimeout(() => {
        abortController.abort();
    }, httpConfig.timeout);

    try {
        const response = await fetch(url, fetchConfig);
        clearTimeout(timerFlag);
        const result: R = await response.json();

        if (response.status === 200) {
            return result;
        } else {
            return Promise.reject(result);
        }

    } catch (err: any) {
        return Promise.reject(err);
    }
}

const get = <R>(path: string, query?: UrlQuery, httpConfig?: HttpConfig) => request<R>(HTTP_METHOD.GET, path, query, undefined, httpConfig);
const post = <R>(path: string, body?: any, httpConfig?: HttpConfig) => request<R>(HTTP_METHOD.POST, path, undefined, body, httpConfig);
const put = <R>(path: string, body?: any, httpConfig?: HttpConfig) => request<R>(HTTP_METHOD.PUT, path, undefined, body, httpConfig);
const del = <R>(path: string, query?: UrlQuery, httpConfig?: HttpConfig) => request<R>(HTTP_METHOD.DELETE, path, query, undefined, httpConfig);

export default {
    get,
    post,
    put,
    del
}