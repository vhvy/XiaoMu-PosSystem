import React, { useEffect, useState, useMemo, useCallback } from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useAjax } from "../../../../AjaxProvider";
import { SearchFn } from "./SearchFn";
import { Categories } from "./Categories";
import { CommodityList } from "./CommodityList";
import { EditForm } from "./EditForm";
import { CommodityTasks } from "../../../../../tasks/commodity";
import {
    setWareSelectCommodityAction
} from "../../../../../redux/action";
import { getFormatTime } from "../../../../../tools/time";


const selector = ({ warehouse }) => ({
    showKeys: warehouse.categories.currentShowKeys,
    selectId: warehouse.commodity.selectId,
    selectType: warehouse.commodity.selectType
});

export function Commodity() {

    const ajax = useAjax();
    const dispatch = useDispatch();

    const { showKeys, selectId, selectType } = useSelector(selector, shallowEqual);

    const [originList, setOriginList] = useState([]);

    async function getCommodity() {
        try {
            const { data } = await CommodityTasks.queryByCategory(ajax, showKeys);
            setOriginList(data);
            data.length !== 0 && dispatch(setWareSelectCommodityAction({
                selectId: data[0] && data[0].id || -1,
                selectType: "origin"
            }));
        } catch (err) {
            console.log(err);
        }
    }

    const commodityList = useMemo(() => {
        return originList.map(({ work_date, change_date, ...args }) => ({
            ...args,
            work_date: getFormatTime(work_date),
            change_date: getFormatTime(change_date)
        }));
    }, [originList]);

    useEffect(() => {
        if (showKeys.length === 0) return;
        getCommodity();
    }, [showKeys]);

    const setSelect = useCallback((data) => {
        dispatch(setWareSelectCommodityAction(data));
    }, [dispatch]);


    useEffect(() => {
        return () => setSelect({
            selectId: -1,
            selectType: "origin"
        });
    }, []);




    const _Categories = useMemo(() => (<Categories />), []);
    // 左侧分类管理界面


    const value = useMemo(() => {
        const length = commodityList.length;
        const index = commodityList.findIndex(i => i.id === selectId);
        const lastItemIndex = commodityList[length - 1] && length - 1 || -1;

        function getId(index) {
            return commodityList[index].id;
        }

        function handleUpSelect() {
            if (length < 2 || index === 0) return;
            setSelect({
                selectId: getId(index - 1),
                selectType: "up"
            });
        }

        function handleDownSelect() {
            if (length < 2 || index === lastItemIndex) return;
            setSelect({
                selectId: getId(index + 1),
                selectType: "down"
            });
        }

        return {
            handleUpSelect,
            handleDownSelect,
            can_edit: length !== 0 && selectId !== -1
        };
    }, [commodityList, selectId]);

    return (
        <div className={styled["commodity-wrap"]}>
            <SearchFn
                value={value}
            />
            <div className={styled["bottom-wrap"]}>
                {_Categories}
                <CommodityList
                    commodityList={commodityList}
                    setSelect={setSelect}
                    selectId={selectId}
                    selectType={selectType}
                />
            </div>
            <EditForm />
        </div>
    );
}