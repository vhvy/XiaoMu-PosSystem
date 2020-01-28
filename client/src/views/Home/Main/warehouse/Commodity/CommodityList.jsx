import React, { useMemo, useCallback } from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import {
    VirtualSelectList,
    VirtualSelectListFooter,
    VirtualSelectListHeader,
    createRenderItemFn
} from "../../../../../components/VirtualSelectList";

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
        title: "名称",
        key: "name",
        type: 2
    },
    {
        title: "规格",
        key: "size",
        type: 5
    },
    {
        title: "单位",
        key: "unit",
        type: 5
    },
    {
        title: "进价",
        key: "in_price",
        type: 1
    },
    {
        title: "售价",
        key: "sale_price",
        type: 1
    },
    {
        title: "库存",
        key: "count",
        type: 1
    },
    // {
    //     title: "供应商",
    //     key: "supplier_id",
    //     type: 1
    // },
    // {
    //     title: "分类",
    //     key: "category_id",
    //     type: 3
    // },
    {
        title: "修改日期",
        key: "change_date",
        type: 2
    },
    {
        title: "建立日期",
        key: "work_date",
        type: 2
    }
];

const footerColumns = (length) => ([
    {
        title: "共计",
        value: length || 0
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

export function CommodityList({ commodityList, setSelect, selectId, selectType }) {

    function handleClickSelect(selectId) {
        setSelect({
            selectId,
            selectType: "click"
        });
    }

    const handleCss = useCallback((css, styled, data) => {
        const { in_price, sale_price } = data;
        if (in_price === 0 || sale_price === 0 || sale_price <= in_price) {
            return [...css, styled["error"]];
        }
        return css;
    }, []);

    const renderItem = useMemo(() => (createRenderItemFn(columns, handleClickSelect, "id", handleCss)), []);

    const Header = useMemo(() => (
        <VirtualSelectListHeader data={columns} />
    ), []);

    const Footer = useMemo(() => (
        <VirtualSelectListFooter data={footerColumns(commodityList.length)} />
    ), [commodityList.length]);

    return (
        <div className={styled["commodity-list-wrap"]}>
            <VirtualSelectList
                wrapCss={styled["list-wrap"]}
                header={Header}
                footer={Footer}
                data={commodityList}
                renderItem={renderItem}
                selectType={selectType}
                select={selectId}
            />
        </div>
    );
}