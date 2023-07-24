import useSWRMutation, { MutationFetcher } from "swr/mutation";
import useSWR from "swr";

import HTTP, { HttpConfig } from "@/utils/http";


export const usePost = <Data, Error, PostData>(path: string, config?: HttpConfig) => {

    return useSWRMutation<Data, Error, string, PostData>(path, (path, { arg }) => {
        return HTTP.post<Data>(path, arg, config);
    });
}

type GetData = string | [string, Record<string, any>];

export const useGet = <Data>(getData: GetData, config?: HttpConfig) => {
    return useSWR(getData, (getData: GetData) => {
        let path, query;
        if (Array.isArray(getData)) {
            path = getData[0];
            query = getData[1];
        } else {
            path = getData;
        }

        return HTTP.get<Data>(path, query, config);
    });
}