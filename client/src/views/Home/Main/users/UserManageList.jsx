import React, { useMemo } from "react";
import styled from "../../../../styles/users.scss";
import { VirtualSelectList } from "../../../../components/VirtualSelectList";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "名称",
        key: "username",
        type: 2
    },
    {
        title: "所属组",
        key: "group",
        type: 2
    },
    {
        title: "状态",
        key: "disabled",
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

export function UserManageList(
    {
        list,
        selectId,
        selectType,
        handleClickSelect
    }
) {

    const footerData = useMemo(() => getFooterColumns(list.length), [list.length]);

    function handleCss(css, styled, data) {
        if (data.disabled === "禁用") {
            return [...css, styled["error"]];
        }
        return css;
    }

    return (
        <VirtualSelectList
            wrapCss={styled["user-manage-list"]}
            data={list}
            select={selectId}
            selectType={selectType}
            columns={columns}
            footerColumn={footerData}
            handleClickSelect={handleClickSelect}
            handleColumnCss={handleCss}
        />
    );
}