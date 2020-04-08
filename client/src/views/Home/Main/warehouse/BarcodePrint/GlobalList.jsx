import React from "react";
import { VirtualSelectList } from "../../../../../components/VirtualSelectList";
import { useMemo } from "react";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "条码",
        key: "barcode",
        type: 2
    },
    {
        title: "名称",
        key: "name",
        type: 2
    },
    {
        title: "售价",
        key: "sale_price",
        type: 3
    },
    {
        title: "单位",
        key: "unit",
        type: 3
    },
    {
        title: "规格",
        key: "size",
        type: 3
    }
];

const getFooterColumns = len => ([
    {
        title: "共计",
        type: 1,
        value: len
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

export function GlobalList({
    selectId,
    selectType,
    handleClick,
    list,
    wrapCss
}) {

    const footerData = useMemo(() => getFooterColumns(list.length), [list.length]);

    return (
        <VirtualSelectList
            wrapCss={wrapCss}
            selectType={selectType}
            select={selectId}
            data={list}
            columns={columns}
            footerColumn={footerData}
            handleClickSelect={handleClick}
        />
    );
}