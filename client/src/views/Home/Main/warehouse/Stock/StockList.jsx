import React, { useMemo, useState } from "react";
import styled from "../../../../../styles/warehouse/stock.scss";
import {
    VirtualSelectList,
    VirtualSelectListHeader,
    VirtualSelectListFooter,
    createRenderItemFn
} from "../../../../../components/VirtualSelectList";
import { getFormatTime } from "../../../../../tools/time";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 5
    },
    {
        title: "供货商",
        key: "supplier_name",
        type: 2
    },
    {
        title: "建立时间",
        key: "date",
        type: 2
    },
    {
        title: "备注",
        key: "description",
        type: 2
    }
];

const getFooterColumns = (length) => ([
    {
        title: "共计",
        type: 1,
        value: length
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

export function StockList({
    list,
    selectId,
    selectType,
    handleClickSelect
}) {

    const data = useMemo(() => list.map(i => ({
        ...i,
        date: getFormatTime(i.date)
    })), [list]);

    const renderItem = useMemo(() => (createRenderItemFn(columns, handleClickSelect)), []);

    const header = useMemo(() => (<VirtualSelectListHeader data={columns} />), []);

    const footer = useMemo(() => (
        <VirtualSelectListFooter data={getFooterColumns(list.length)} />
    ), [list.length]);

    return (
        <VirtualSelectList
            wrapCss={styled["stock-left"]}
            header={header}
            footer={footer}
            select={selectId}
            data={data}
            renderItem={renderItem}
            selectType={selectType}
        />
    );
}