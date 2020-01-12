import React, { useState, useEffect, useMemo } from "react";

import {
    VirtualSelectList,
    VirtualSelectListHeader,
    createRenderItemFn
} from "../../../../../../../components/VirtualSelectList";

const OrderDetailsColumns = [
    {
        title: "序号",
        key: "index",
        type: 1,
        center: true
    },
    {
        title: "条码",
        key: "barcode",
        type: 2,
        center: true
    },
    {
        title: "商品名称",
        key: "name",
        type: 2,
        center: true
    },
    {
        title: "原价",
        key: "origin_price",
        type: 3,
        center: true
    },
    {
        title: "售价",
        key: "sale_price",
        type: 3,
        center: true
    },
    {
        title: "数量",
        key: "count",
        type: 3,
        center: true
    },
    {
        title: "金额",
        key: "money",
        type: 3,
        center: true
    }
];

export function OrderDetails({ data, wrapCss }) {
    if (data.length === 0) return null;

    const Header = useMemo(() => (
        <VirtualSelectListHeader data={OrderDetailsColumns} />
    ), []);

    const initState = {
        select: data[0].id,
        selectType: "origin"
    };

    const [selectData, setSelect] = useState(initState);

    const { select, selectType } = selectData;

    function handleSelect(id) {
        setSelect({
            select: id,
            selectType: "click"
        });
    }

    const renderItem = useMemo(() => createRenderItemFn(OrderDetailsColumns, handleSelect), [handleSelect]);

    useEffect(() => {
        setSelect(initState);
    }, [data]);

    return (
        <VirtualSelectList
            wrapCss={wrapCss}
            header={Header}
            data={data}
            select={select}
            selectType={selectType}
            renderItem={renderItem}
        />
    );
}