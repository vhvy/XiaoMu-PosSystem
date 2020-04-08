import React, { useMemo } from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { LoadingBox } from "../../../../../components/LoadingBox";
import { VirtualSelectList } from "../../../../../components/VirtualSelectList";
import { mathc } from "../../../../../tools/mathc";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "状态",
        key: "status",
        type: 1
    },
    {
        title: "条码",
        key: "barcode",
        type: 2
    },
    {
        title: "商品名称",
        key: "name",
        type: 2
    },
    {
        title: "数量",
        key: "count",
        type: 3
    },
    {
        title: "进价",
        key: "in_price",
        type: 3
    },
    {
        title: "售价",
        key: "origin_price",
        type: 3
    },
    {
        title: "实际售价",
        key: "sale_price",
        type: 3
    },
    {
        title: "总金额",
        key: "sum_price",
        type: 3
    }
];

function getFooterColumns(length) {
    return [
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
    ];
}

export function OrderDetails({
    commodity_list,
    selectId,
    selectType,
    load,
    handleClick
}) {


    const footerData = useMemo(() => getFooterColumns(commodity_list.length), [commodity_list.length]);

    const data = useMemo(() => commodity_list.map(item => ({
        ...item,
        sum_price: mathc.multiply(item.count, item.sale_price)
    })), [commodity_list]);

    return (
        <div
            className={styled["order-details"]}
        >
            <LoadingBox
                status={load}
            />
            <VirtualSelectList
                columns={columns}
                footerColumn={footerData}
                handleClickSelect={handleClick}
                data={data}
                select={selectId}
                selectType={selectType}
                wrapCss={styled["order-commodity-list"]}
            />
        </div>
    );
}