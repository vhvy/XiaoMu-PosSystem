import React from "react";
import styled from "../../../../../styles/promotion/commodity.scss";
import { LoadingBox } from "../../../../../components/LoadingBox";
import { VirtualSelectList } from "../../../../../components/VirtualSelectList";
import { useMemo } from "react";

const getFooterColumn = len => (
    [
        {
            title: "共计",
            value: len || 0
        },
        {
            title: "SPACE",
            type: 2,
            value: ""
        }
    ]
);

const columns = [
    {
        title: "序号",
        key: "index",
        type: 5
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
        title: "进价",
        key: "in_price",
        type: 5,
    },
    {
        title: "售价",
        key: "sale_price",
        type: 5
    },
    {
        title: "促销类型",
        key: "promotion_type_name",
        type: 3
    },
    {
        title: "促销价格/折扣",
        key: "discount_value",
        type: 4
    }
];

export function CommodityList({
    status,
    handleClick,
    selectId,
    selectType,
    list
}) {


    const footerData = useMemo(() => getFooterColumn(list.length), [list.length]);

    return (
        <div className={styled["commodity-list-wrap"]}>
            <LoadingBox
                status={status}
            />
            <VirtualSelectList
                wrapCss={styled["commodity-list"]}
                select={selectId}
                selectType={selectType}
                columns={columns}
                footerColumn={footerData}
                handleClickSelect={handleClick}
                data={list}
            />
        </div>
    );
}