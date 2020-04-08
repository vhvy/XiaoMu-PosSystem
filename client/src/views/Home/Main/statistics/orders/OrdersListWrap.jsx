import React, { useMemo, useEffect } from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { OrderList } from "./OrderList";
import { OrderDetails } from "./OrderDetails";
import { StatisticsTasks } from "../../../../../tasks/statistics";
import { useAjax } from "../../../../AjaxProvider";

const initOrderDetailsState = {
    commodity_list: [],
    selectId: -1,
    selectType: "origin",
    load: false
};

export function OrdersListWrap({
    timerange,
    ordersData,
    orderDetailsData,
    handleOrderDetailsClick,
    handleOrderListClick,
    setOrdersData,
    setOrderDetailsData,
    nextSelectCommodityFlag,
    resetFlag
}) {

    const currentOrderId = useMemo(() => {
        const { order_list, selectId } = ordersData;
        const order = order_list.find(i => i.id === selectId);
        return order && order.order_id || null;
    }, [ordersData]);
    // 当前订单id

    const ajax = useAjax();

    async function getOrders() {
        // 获取订单列表

        !ordersData.load && setOrdersData(s => ({
            ...s,
            load: true
        }));

        try {
            const { data } = await StatisticsTasks.getOrderList(ajax, timerange);

            setOrdersData(s => ({
                ...s,
                order_list: data,
                selectId: data[0] && data[0].id || -1,
                selectType: "origin",
                load: false
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async function getOrderDetails() {
        // 获取订单商品列表信息

        if (!currentOrderId) {
            // 当前时间范围不存在任何订单

            if (orderDetailsData.commodity_list.length !== 0) {
                // 当前订单商品数据列表还存在上次选择时间范围遗留商品时
                // 对state进行初始化
                setOrderDetailsData(initOrderDetailsState);
            }


            return;
        }

        setOrderDetailsData(s => ({
            ...s,
            load: true
        }));

        try {
            const { data } = await StatisticsTasks.getOrderDetails(ajax, currentOrderId);
            if (!nextSelectCommodityFlag) {
                setOrderDetailsData(s => ({
                    ...s,
                    commodity_list: data,
                    selectId: data[0] && data[0].id || -1,
                    selectType: "origin",
                    load: false
                }));
            } else {
                setOrderDetailsData(s => ({
                    ...s,
                    commodity_list: data,
                    selectId: nextSelectCommodityFlag,
                    selectType: "down",
                    load: false
                }));
                nextSelectCommodityFlag && resetFlag();
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getOrders();
    }, [timerange]);

    useEffect(() => {
        getOrderDetails();
    }, [currentOrderId]);


    return (
        <div
            className={styled["sales-list-wrap"]}
        >
            <OrderList
                {...ordersData}
                handleClick={handleOrderListClick}
            />
            <OrderDetails
                {...orderDetailsData}
                handleClick={handleOrderDetailsClick}
            />
        </div>
    );
}