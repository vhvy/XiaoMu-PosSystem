import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export type DispatchPageFn = Dispatch<SetStateAction<number>>;

const usePage = (defaultPage = 1, defaultLimit = 15): [number, number, DispatchPageFn, DispatchPageFn] => {
    const [page, setPage] = useState<number>(defaultPage);
    const [limit, setLimit] = useState<number>(defaultLimit);

    return [page, limit, setPage, setLimit];
}

export default usePage;