import React, { useMemo, useState } from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { useTime } from "../hooks/useTime";
import { OrdersListWrap } from "./OrdersListWrap";
import { OrderFn } from "./OrderFn";
import { useAjax } from "../../../../AjaxProvider";
import { StatisticsTasks } from "../../../../../tasks/statistics";
import { useEffect } from "react";

const initOrderDetailsState = {
    commodity_list: [],
    selectId: -1,
    selectType: "origin",
    load: false
};
// 订单商品列表状态

const initOrderState = {
    order_list: [],
    selectId: -1,
    selectType: "origin",
    load: true
};
// 订单列表状态

const initSearchState = {
    data: [],
    index: -1
};

let nextCommoditySelectIdFlag = null;

function resetFlag() {
    nextCommoditySelectIdFlag = null;
}

export function Orders() {

    const ajax = useAjax();

    const searchConfig = [
        {
            type: "商品名称/简称",
            key: "name",
            isLocal: false
        },
        {
            type: "商品条码",
            key: "barcode",
            isLocal: false
        },
        {
            type: "订单号",
            isLocal: true,
            fn: (data, query) => {
                return (data
                    .filter(({ order_id }) => (order_id + "").includes(query))
                    .map(({ id, order_id }) => ({ id, order_id })));
            }
        },
        {
            type: "会员卡号",
            isLocal: true,
            fn: (data, query) => {
                return (data
                    .filter(({ vip_code }) =>
                        vip_code && vip_code.includes(query))
                    .map(({ id, order_id }) => ({ id, order_id }))
                );
            }
        },
    ];
    // 搜索数据类型设置

    const searchTypeList = useMemo(() => (searchConfig.map(({ type }) => type)), []);
    // 搜索数据类型列表

    const [currentType, setCurrentType] = useState(searchTypeList[0]);
    // 用来查询订单的数据类型

    function handleTypeChange(type) {
        // 设置当前用来查询的数据类型
        setCurrentType(type);
    }

    const [BaseModal, currentTime] = useTime();
    // 当前选择的时间范围以及用来选择的按钮

    const [searchData, setSearchData] = useState(initSearchState);


    const [ordersData, setOrdersData] = useState(initOrderState);
    // 订单列表数据

    console.log(searchData);
    const [orderDetailsData, setOrderDetailsData] = useState(initOrderDetailsState);
    // 订单商品列表数据

    function handleOrderDetailsClick(selectId) {
        // 设置当前选中订单商品
        setOrderDetailsData(s => ({
            ...s,
            selectId,
            selectType: "click"
        }))
    }

    function handleOrderListClick(selectId) {
        // 设置当前选中订单
        setOrdersData(s => ({
            ...s,
            selectId,
            selectType: "click"
        }));
    }

    function next() {
        // 选择搜索出的数据
        // 前进

        const { index, data } = searchData;
        const newIndex = data[index + 1] ? index + 1 : 0;
        setSearchData(s => ({
            ...s,
            index: newIndex
        }));
    }

    function prev() {
        // 选择搜索出的数据
        // 后退

        const { index, data } = searchData;
        const newIndex = data[index - 1] ? index - 1 : data.length - 1;
        setSearchData(s => ({
            ...s,
            index: newIndex
        }));
    }

    async function handleSearch(_query) {
        // 查询某个商品或订单

        const query = _query.trim();
        if (query === "" || ordersData.order_list.length === 0) return;

        const { fn, isLocal, key } = searchConfig.find(i => i.type === currentType);

        let data;
        if (isLocal) {
            data = fn(ordersData.order_list, query);
        } else {
            const [start_time, end_time] = currentTime;
            try {
                const { data: _data } = await StatisticsTasks.queryOrderDetailsByKey(ajax, {
                    type: key,
                    query,
                    start_time,
                    end_time
                });

                data = _data;
            } catch (error) {
                console.log(error);
            }
        }

        if (searchData.data.length === 0 && data.length === 0) return;

        setSearchData(s => ({
            ...s,
            data,
            index: data.length === 0 ? -1 : 0
        }));
    }

    useEffect(() => {
        // 搜索数据发生变化时刷新选中条目

        const { data, index } = searchData;
        if (data.length === 0) return;
        const { id, commodity_id } = data[index];

        if (id === ordersData.selectId) {
            setOrderDetailsData(s => ({
                ...s,
                selectId: commodity_id,
                selectType: "down"
            }));
        } else {
            setOrdersData(s => ({
                ...s,
                selectId: id,
                selectType: "down"
            }));

            commodity_id && (nextCommoditySelectIdFlag = commodity_id);
        }
    }, [searchData]);

    useEffect(() => {

        searchData.data.length !== 0 && setSearchData(initSearchState);
    }, [currentTime]);

    const MemoOrdersList = useMemo(() => (
        <OrdersListWrap
            timerange={currentTime}
            ordersData={ordersData}
            orderDetailsData={orderDetailsData}
            handleOrderDetailsClick={handleOrderDetailsClick}
            handleOrderListClick={handleOrderListClick}
            setOrdersData={setOrdersData}
            setOrderDetailsData={setOrderDetailsData}
            nextSelectCommodityFlag={nextCommoditySelectIdFlag}
            resetFlag={resetFlag}
        />
    ), [
        currentTime[0],
        currentTime[1],
        ordersData,
        orderDetailsData,
        handleOrderDetailsClick,
        handleOrderListClick,
        setOrderDetailsData,
        setOrdersData,
        nextCommoditySelectIdFlag
    ]);

    return (
        <div className={styled["sales-wrap"]}>
            <OrderFn
                BaseModal={BaseModal}
                typeList={searchTypeList}
                currentType={currentType}
                handleTypeChange={handleTypeChange}
                handleSearch={handleSearch}
                searchData={searchData}
                next={next}
                prev={prev}
            />
            {
                MemoOrdersList
            }
        </div>
    );
}