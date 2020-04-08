import React, { useState, useMemo } from "react";
import { Modal, message } from "antd";
import styled from "../../../../../styles/promotion/manage.scss";
import { PromotionManage } from "../../../../../tasks/promotion";
import { ManageFn } from "./ManageFn";
import { PromotionList } from "./PromotionList";
import { ModifyDrawer } from "./ModifyDrawer";
import { usePromo } from "../usePromo";
import { getFormatTime } from "../../../../../tools/time";
import { useAjax } from "../../../../AjaxProvider";

export function Promotion() {

    const ajax = useAjax();

    const [loadingStatus, setLoadStatus] = useState(true);
    // loading动画状态

    const [drawerData, setDrawerData] = useState({
        status: false,
        type: "add"
    });

    const [selectData, setSelectData] = useState({
        selectId: -1,
        selectType: "origin"
    });


    const [promoList, setPromoList] = usePromo(ajax, (list) => {
        setLoadStatus(false);
        list.length !== 0 && setSelectData(s => ({
            ...s,
            selectId: list[0].id
        }));
    });
    // 促销活动列表，以及刷新促销活动列表的方法

    function closeModal() {
        setDrawerData(s => ({
            ...s,
            status: false
        }));
    }

    const mapPromoList = useMemo(() => promoList.map(({
        start_date,
        end_date,
        ...args
    }) => ({
        ...args,
        start_date: getFormatTime(start_date),
        end_date: getFormatTime(end_date)
    })), [promoList]);

    const currentPromo = useMemo(() => promoList.find(i => i.id === selectData.selectId), [selectData.selectId, promoList]);
    // 当前选中的活动

    function handleClick(selectId) {
        setSelectData({
            selectId,
            selectType: "click"
        });
    }

    function handleAdd() {
        setDrawerData(s => ({
            ...s,
            status: true,
            type: "add"
        }));
    }

    function handleEdit() {
        setDrawerData(s => ({
            ...s,
            status: true,
            type: "edit"
        }));
    }

    function handleDel() {
        if (selectData.selectId === -1) return;

        const { name } = currentPromo;

        async function del() {
            try {
                await PromotionManage.delPromotion(ajax, name);
                message.success("删除成功!");

                const index = promoList.findIndex(i => i.name === name);

                let selectId = -1;

                if (promoList.length !== 1) {
                    if (index === promoList.length - 1) {
                        // 当前选中活动是最后一个活动

                        selectId = promoList[index - 1].id;
                    } else {
                        // 当前选中活动不是最后一个活动

                        selectId = promoList[index + 1].id;
                    }
                }

                setPromoList(s => s.filter(i => i.name !== name));

                setSelectData(s => ({
                    ...s,
                    selectId,
                    selectType: "origin"
                }));
            } catch (error) {
                console.log(error);
            }
        }

        Modal.confirm({
            title: `确定要删除${name}?`,
            okText: "删除",
            okButtonProps: {
                type: "danger"
            },
            onOk: del
        });
    }

    function handleSearch(query) {
        if (promoList.length < 2) return;
        const promo = promoList.find(i => i.name.includes(query));
        promo && promo.id !== selectData.selectId && setSelectData(s => ({
            ...s,
            selectId: promo.id,
            selectType: "origin"
        }));
    }

    return (
        <div className={styled["promotion-manage-wrap"]}>
            <ManageFn
                handleAdd={handleAdd}
                handleDel={handleDel}
                handleEdit={handleEdit}
                canChange={selectData.selectId !== -1}
                handleSearch={handleSearch}
            />
            <PromotionList
                loadingStatus={loadingStatus}
                promoList={mapPromoList}
                handleClick={handleClick}
                {...selectData}
            />
            <ModifyDrawer
                {...drawerData}
                closeFn={closeModal}
                currentPromo={currentPromo}
                ajax={ajax}
                setPromoList={setPromoList}
            />
        </div>
    );
}