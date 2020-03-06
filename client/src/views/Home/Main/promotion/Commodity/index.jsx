import React, { useState, useMemo, useEffect } from "react";
import styled from "../../../../../styles/promotion/commodity.scss";
import { CommodityFn } from "./CommodityFn";
import { CommodityList } from "./CommodityList";
import { usePromo, usePromoType } from "../usePromo";
import { useAjax } from "../../../../AjaxProvider";
import { useSelect } from "../../../../../components/VirtualSelectList";
import { useCommodity } from "../useCommodity";
import { Modal, message } from "antd";
import { PromotionManage } from "../../../../../tasks/promotion";
import { ModifyDrawer } from "./ModiftDrawer";

export function PromotionCommodityManage() {

    const ajax = useAjax();

    const [loadStatus, setLoadStatus] = useState(true);
    // load动画的状态

    const [selectData, setSelectData, handleClick] = useSelect();
    // 当前选中的商品

    const [promoTypeList] = usePromoType(ajax);

    const [drawerData, setDrawerData] = useState({
        type: "add",
        status: false
    });

    function handleAdd() {
        setDrawerData(s => ({
            ...s,
            type: "add",
            status: true,
        }));
    }

    function handleEdit() {
        setDrawerData(s => ({
            ...s,
            type: "edit",
            status: true,
        }));
    }

    function closeDrawer() {
        setDrawerData(s => ({
            ...s,
            status: false
        }));
    }

    const [basePromoList] = usePromo(ajax);
    // 所有的促销活动

    const [currentPromo, setCurrentPromo] = useState();
    // 当前选中的促销活动名称

    const [commodityList, setCommodityList, flushList] = useCommodity(currentPromo, ajax, () => setLoadStatus(false));

    const promoList = useMemo(() => basePromoList.map(({ name }) => name), [basePromoList]);
    // map出促销活动名称

    const selectCommodity = useMemo(() => commodityList.find(i => i.id === selectData.selectId), [selectData.selectId, currentPromo]);

    useEffect(() => {

        !loadStatus && setLoadStatus(true);

        flushList(currentPromo, data => {
            setLoadStatus(false);
            data && setSelectData(s => ({
                ...s,
                selectId: data[0] ? data[0].id : -1,
                selectType: "origin"
            }));
        });
    }, [currentPromo]);

    function handleDelCommod() {
        async function runDel(cb) {
            const index = commodityList.findIndex(i => i.id === selectData.selectId);
            const { barcode } = commodityList[index];
            try {
                await PromotionManage.delCommodityByPromo(ajax, currentPromo, barcode);

                let selectId = -1;

                if (commodityList.length > 1) {

                    selectId = (
                        (index === (commodityList.length - 1)
                        ) ?
                            commodityList[index - 1]
                            : commodityList[index + 1]).id;

                }

                setSelectData(s => ({
                    ...s,
                    selectId,
                    selectType: "origin"
                }));

                setCommodityList(list => list.filter(i => i.barcode !== barcode));

                message.success("商品删除成功!");

                cb();
                // 关闭Modal

            } catch (error) {
                console.log(error);
            }
        }

        Modal.confirm({
            title: "确认要从促销活动中删除此商品?",
            okText: "删除",
            okButtonProps: {
                type: "danger"
            },
            onOk: runDel
        });
    }

    return (
        <div className={styled["commodity-wrap"]}>
            <CommodityFn
                promoList={promoList}
                currentPromo={currentPromo}
                setCurrentPromo={setCurrentPromo}
                cantEditCommod={selectData.selectId !== -1}
                handleDelCommod={handleDelCommod}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
            />
            <CommodityList
                status={loadStatus}
                handleClick={handleClick}
                list={commodityList}
                {...selectData}
            />
            <ModifyDrawer
                {...drawerData}
                closeFn={closeDrawer}
                promoTypeList={promoTypeList}
                ajax={ajax}
                selectCommodity={selectCommodity}
                currentPromo={currentPromo}
                setCommodityList={setCommodityList}
            />
        </div>
    );
}