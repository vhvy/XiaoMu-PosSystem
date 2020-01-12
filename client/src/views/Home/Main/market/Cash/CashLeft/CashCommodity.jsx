import React from "react";
import styled from "../../../../../../styles/cash.scss";
import {
    VirtualSelectList,
    VirtualSelectListHeader,
    VirtualSelectListFooter,
    createRenderItemFn
} from "../../../../../../components/VirtualSelectList";
import { useMemo } from "react";

/**
 * type
 * 1: 序号状态，占比很小的字段
 * 2: 需要自适应宽度的字段
 * 3: 价格、数量等字段
 */

export const columns = [
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
        title: "单位",
        key: "unit",
        type: 1
    },
    {
        title: "规格",
        key: "size",
        type: 1
    },
    {
        title: "原价",
        key: "origin_price",
        type: 3
    },
    {
        title: "售价",
        key: "sale_price",
        type: 3
    },
    {
        title: "数量",
        key: "count",
        type: 3
    },
    {
        title: "金额",
        key: "money",
        type: 3
    }
];

const getFooterData = (data, count, money) => ([
    {
        title: "共计",
        type: 1,
        value: data.length || 0
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    },
    {
        title: "数量",
        type: 3,
        value: count
    },
    {
        title: "金额",
        type: 3,
        value: money
    }
]);

export function CashCommodity({ commodityList, select, selectType, clickSelect, count, money }) {

    const wrapCss = styled["cash-commodity"];

    const renderItem = useMemo(() => createRenderItemFn(columns, clickSelect), [clickSelect]);

    const footerData = useMemo(() => getFooterData(commodityList, count, money), [commodityList, count, money]);

    const Header = useMemo(() => (
        <VirtualSelectListHeader data={columns} />
    ), [columns]);

    const Footer = useMemo(() => (
        <VirtualSelectListFooter data={footerData} />
    ), [footerData]);

    return (
        <VirtualSelectList
            wrapCss={wrapCss}
            header={Header}
            footer={Footer}
            data={commodityList}
            select={select}
            selectType={selectType}
            renderItem={renderItem}
        />
    );
}