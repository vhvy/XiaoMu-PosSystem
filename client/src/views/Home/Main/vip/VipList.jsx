import React, { useMemo } from "react";
import styled from "../../../../styles/vip.scss";
import { VirtualSelectList } from "../../../../components/VirtualSelectList";

const getFooterColumns = (length) => ([
    {
        title: "共计",
        type: 1,
        value: length || 0
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

const columns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "类型",
        key: "vip_type",
        type: 3
    },
    {
        title: "卡号",
        key: "code",
        type: 3
    },
    {
        title: "姓名",
        key: "name",
        type: 3
    },
    {
        title: "性别",
        key: "sex",
        type: 1
    },
    {
        title: "手机号",
        key: "phone",
        type: 2
    },
    {
        title: "办理时间",
        key: "create_date",
        type: 2
    },
    {
        title: "修改时间",
        key: "change_date",
        type: 2
    }
];

function handleCss(css, styled, data) {
    if (data.is_disable) {
        return [...css, styled["undo"]];
    }
    return css;
}

export function VipList({ list, selectId, selectType, handleSelect }) {

    const footerData = useMemo(() => getFooterColumns(list.length), [list.length]);

    return (
        <VirtualSelectList
            wrapCss={styled["vip-list"]}
            select={selectId}
            selectType={selectType}
            data={list}
            columns={columns}
            footerColumn={footerData}
            handleClickSelect={handleSelect}
            handleColumnCss={handleCss}
        />
    );
}