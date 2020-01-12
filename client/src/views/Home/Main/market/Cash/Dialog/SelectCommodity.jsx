import React from "react";
import { Modal, message } from "antd";
import styled from "../../../../../../styles/cash.scss";
import {
    VirtualSelectList,
    VirtualSelectListHeader,
    VirtualSelectListFooter,
    createRenderItemFn
} from "../../../../../../components/VirtualSelectList";
import { useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";




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
    }
];

const getFooterData = (data) => ([
    {
        title: "共计",
        type: 1,
        value: data.length || 0
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

export function SelectCommodity({
    data,
    closeFn
}) {

    const { show, list } = data;
    const [selectValue, setSelect] = useState({
        selectType: "ondata",
        select: 0
    });


    const { select, selectType } = selectValue;

    function selectAndHideModal() {
        const data = list.find(({ id }) => id === select);
        if (data.is_delete) {
            message.error("此商品已被禁用!")
        } else if (data.sale_price === 0) {
            message.error("此商品尚未设置价格，请联系管理员!");
        } else {
            closeFn(data);
        }
    }

    function hideModal() {
        closeFn();
    }

    function handleClick(id) {
        setSelect({
            selectType: "click",
            select: id
        });
    }

    const renderItem = useMemo(() => createRenderItemFn(columns, handleClick), [columns]);

    const footerData = useMemo(() => getFooterData(list), [list]);

    const Header = useMemo(() => (
        <VirtualSelectListHeader data={columns} />
    ), [columns]);

    const Footer = useMemo(() => (
        <VirtualSelectListFooter data={footerData} />
    ), [footerData]);


    function handleKeyArrow({ key }) {

        const index = list.findIndex(t => t.id === select);
        if (key === "ArrowUp" && index > 0) {
            setSelect({
                selectType: "up",
                select: list[index - 1].id
            });
        } else if (key === "ArrowDown" && index < list.length - 1) {
            setSelect({
                selectType: "down",
                select: list[index + 1].id
            });
        } else if (key === "Enter") {
            selectAndHideModal();
        }
    }

    useEffect(() => {
        setSelect(s => ({
            ...s,
            select: list[0] && list[0].id || 0
        }))
    }, [list]);

    return (

        <div onKeyDown={handleKeyArrow}>
            <Modal
                title="请选择商品"
                destroyOnClose={true}
                visible={show}
                onOk={selectAndHideModal}
                onCancel={hideModal}
                wrapClassName={styled["cash-dialog-commodity"]}
                style={{
                    minWidth: 800
                }}
            >
                <VirtualSelectList
                    wrapCss={styled["wrapper"]}
                    header={Header}
                    footer={Footer}
                    data={list}
                    renderItem={renderItem}
                    select={select}
                    selectType={selectType}
                />
            </Modal>

        </div>
    );
}