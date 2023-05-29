import useSWRMutation, { MutationFetcher } from "swr/mutation";

import HTTP, { HttpConfig } from "@/utils/http";


export const usePost = <Data, Error, PostData>(path: string, config?: HttpConfig) => {

    return useSWRMutation<Data, Error, string, PostData>(path, (path, { arg }) => {
        return HTTP.post<Data>(path, arg, config);
    });
}