import {
    Button, Select
} from "@fluentui/react-components";
import {
    ArrowLeft24Regular,
    ArrowRight24Regular,
    MoreHorizontal24Regular,
} from "@fluentui/react-icons";
import React, { useEffect, useMemo } from "react";
import classNames from "classnames";

import CodIcon from "@/components/CodIcon";

import useLocale from "@/hooks/useLocale";
import type { DispatchPageFn } from "@/hooks/usePage";

import classes from "./index.module.scss";

type Props = {
    total: number,
    page: number,
    limit: number,
    setPage: DispatchPageFn,
    setLimit?: DispatchPageFn
}

const createNumList = (start: number = 1, end: number = 1): number[] => {
    return [...Array(end + 1).keys()].slice(start);
}

const enum PageShift {
    LEFT_SHIFT = -1,
    RIGHT_SHIFT = -2,
    SHIFT_SIZE = 5
};

const Pagination = ({ total = 0, limit = 15, page = 1, setPage, setLimit }: Props) => {

    const { locale } = useLocale();

    const pageCount = useMemo(() => Math.ceil(total / limit) || 1, [total, limit]);

    const pageList = useMemo<number[]>(() => {

        let pageNumList = createNumList(1, pageCount);

        if (pageCount <= 8) {
            return pageNumList;
        }

        if (page < 5) {
            return [
                ...pageNumList.slice(0, PageShift.SHIFT_SIZE),
                PageShift.RIGHT_SHIFT,
                pageCount
            ];
        } else if (page + 4 > pageCount) {
            return [
                1,
                PageShift.LEFT_SHIFT,
                ...pageNumList.slice(pageCount - PageShift.SHIFT_SIZE),
            ];
        } else {
            return [
                1,
                PageShift.LEFT_SHIFT,
                ...pageNumList.slice(page - 3, page + 2),
                PageShift.RIGHT_SHIFT,
                pageCount
            ];
        }

    }, [pageCount, page]);

    interface LimitConfig {
        limit: number,
        text: string
    };

    const limitList = useMemo<LimitConfig[]>(() => {
        const limits = [10, 15, 20, 30, 50, 100];

        return limits.map(limit => {
            return {
                limit,
                text: locale.Pagination.limit$Option.replace("$0", limit + "")
            }
        });
    }, [locale]);

    const handleStepPage = (isNext = true) => {
        if (isNext && page < pageCount) {
            setPage(n => n + 1);
        } else if (!isNext && page > 1) {
            setPage(n => n - 1);
        }
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e.target.value);

        setLimit && setLimit(limit);
    }

    useEffect(() => {
        const maxPage = pageList[pageList.length - 1];

        if (page > maxPage) {
            setPage(maxPage);
        }

    }, [limit, page]);

    const handlePageLeftShift = () => {
        setPage(p => p - PageShift.SHIFT_SIZE <= 1 ? 1 : p - PageShift.SHIFT_SIZE);
    }

    const handlePageRightShift = () => {
        setPage(p => p + PageShift.SHIFT_SIZE >= pageCount ? pageCount : p + PageShift.SHIFT_SIZE);
    }

    return (
        <div className={classNames(classes.pagination_container, "flex", "flex-center")}>
            <Button
                title={locale.Pagination.prevPageTip}
                disabled={page <= 1}
                className={classes.page_button}
                appearance="transparent"
                icon={<ArrowLeft24Regular />}
                onClick={() => handleStepPage(false)}
            />
            {
                pageList.map(pageNum => {

                    if (pageNum === PageShift.LEFT_SHIFT) {
                        const prevTitleTip = locale.Pagination.previous$Pages.replace("$0", "5");
                        return (
                            <div
                                title={prevTitleTip}
                                key={pageNum}
                                onClick={handlePageLeftShift}
                                className={classNames(classes.page_shift_button, "flex", "flex-center", "pointer", "relative")}
                            >
                                <MoreHorizontal24Regular className={classNames(classes.page_shift_default_icon, "abs")} />
                                <CodIcon icon="fold-down" className={classNames(classes.page_shift_double_icon, classes.left, "abs")} size={12} />
                            </div>
                        );
                    } else if (pageNum === PageShift.RIGHT_SHIFT) {
                        const nextTitleTip = locale.Pagination.next$Pages.replace("$0", "5");
                        return (
                            <div
                                title={nextTitleTip}
                                key={pageNum}
                                onClick={handlePageRightShift}
                                className={classNames(classes.page_shift_button, "flex", "flex-center", "pointer", "relative")}
                            >
                                <MoreHorizontal24Regular className={classNames(classes.page_shift_default_icon, "abs")} />
                                <CodIcon icon="fold-down" className={classNames(classes.page_shift_double_icon, classes.right, "abs")} size={12} />
                            </div>
                        );
                    } else {
                        return (
                            <Button
                                key={pageNum}
                                title={pageNum + ""}
                                onClick={() => setPage(pageNum)}
                                className={classes.page_button}
                                appearance={pageNum === page ? "primary" : "secondary"}
                                shape="square">
                                {pageNum}
                            </Button>
                        );
                    }
                })
            }
            <Button
                title={locale.Pagination.nextPageTip}
                disabled={page >= pageCount}
                className={classes.page_button}
                appearance="transparent"
                icon={<ArrowRight24Regular />}
                onClick={() => handleStepPage()}
            />
            <Select value={limit} className={classes.page_limit_select} onChange={handleLimitChange}>
                {
                    limitList.map(i => (
                        <option value={i.limit} key={i.limit}>{i.text}</option>
                    ))
                }
            </Select>
        </div >
    );
}

export default Pagination;