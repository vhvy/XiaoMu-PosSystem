import React, { useMemo } from "react";
import styled from "../../../../../styles/promotion/manage.scss";
import { LoadingBox } from "../../../../../components/LoadingBox";
import {
    VirtualSelectList
} from "../../../../../components/VirtualSelectList";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 5
    },
    {
        title: "活动名称",
        key: "name",
        type: 2
    },
    {
        title: "开始时间",
        key: "start_date",
        type: 6
    },
    {
        title: "结束时间",
        key: "end_date",
        type: 6
    },
    {
        title: "备注",
        key: "description",
        type: 4
    }
];

const getFooterColumns = len => ([
    {
        title: "共计",
        value: len || 0
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

export function PromotionList({
    loadingStatus,
    promoList,
    handleClick,
    selectId,
    selectType
}) {


    const footerData = useMemo(() => getFooterColumns(promoList.length), [promoList.length]);


    return (
        <div className={styled["manage-list-wrap"]}>
            <LoadingBox
                status={loadingStatus}
            />
            <VirtualSelectList
                wrapCss={styled["manage-list"]}
                data={promoList}
                columns={columns}
                footerColumn={footerData}
                handleClickSelect={handleClick}
                selectType={selectType}
                select={selectId}
            />
        </div>
    );
}