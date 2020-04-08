import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "antd";
import styled from "../../../../../../styles/cash.scss";
import { VirtualSelectList } from "../../../../../../components/VirtualSelectList";
import { mathc } from "../../../../../../tools/mathc";
import { useDispatch } from "react-redux";
import { getHangupOrderAction } from "../../../../../../redux/action";
import { OrderDetails } from "./common/OrderDetails";

const OrderListColumns = [
    {
        title: "序号",
        key: "index",
        type: 1,
        center: true
    },
    {
        title: "数量",
        key: "count",
        type: 3,
        center: true
    },
    {
        title: "金额",
        key: "money",
        type: 3,
        center: true
    },
    {
        title: "会员卡号",
        key: "vipCode",
        type: 3,
        center: true
    },
    {
        title: "会员姓名",
        key: "name",
        type: 3,
        center: true
    },
    {
        title: "提交时间",
        key: "time",
        type: 2,
        center: true
    }

];

const OrderListFooter = (length) => ([
    {
        title: "共计",
        type: 1,
        value: length || 0,
        center: true
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

function OrderList({
    list,
    selectType,
    select,
    clickSelect
}) {



    const data = useMemo(() => list.map(({ id, vip, commodityList, time }) => {

        let _count = 0, _money = 0;

        commodityList.map(({ count, money }) => {
            _count = mathc.add(count, _count);
            _money = mathc.add(money, _money);
        });

        return {
            id,
            vipCode: vip.code || "无",
            name: vip.name || "无",
            count: _count,
            money: _money,
            time
        };
    }), [list]);

    const footerData = useMemo(() => OrderListFooter(data.length), [data.length]);

    return (
        <VirtualSelectList
            wrapCss={styled["order-list"]}
            data={data}
            select={select}
            selectType={selectType}
            columns={OrderListColumns}
            footerColumn={footerData}
            handleClickSelect={clickSelect}
        />
    );
}





export function HandUpOrder({
    status,
    hideFn,
    list
}) {

    const dispatch = useDispatch();

    function closeModal() {
        // 关闭查询挂单界面
        hideFn();
    }

    const initState = {
        select: list[0] && list[0].id || 0,
        selectType: "origin",
        currentData: list[0] && list[0].commodityList || []
    };

    const [selectData, setSelectData] = useState(initState);

    const { selectType, select, currentData } = selectData;

    function clickSelect(select) {
        setSelectData(s => ({
            ...s,
            select,
            currentData: list.find(({ id }) => id === select).commodityList
        }));
    }


    function getOrder() {
        // 取出订单数据

        closeModal();

        dispatch(getHangupOrderAction({
            data: list.find(({ id }) => id === select),
            id: select
        }));

    }

    function handleHotKey(e) {
        const { key } = e;
        if (key === "ArrowUp") {
            const index = list.findIndex(({ id }) => id === select);
            if (list.length < 1 || index < 1) return;
            e.preventDefault();
            setSelectData({
                select: list[index - 1].id,
                selectType: "up",
                currentData: list.find(({ id }) => id === list[index - 1].id).commodityList
            });
        } else if (key === "ArrowDown") {
            const index = list.findIndex(({ id }) => id === select);
            if (list.length < 1 || index >= list.length - 1) return;
            e.preventDefault();
            setSelectData({
                select: list[index + 1].id,
                selectType: "down",
                currentData: list.find(({ id }) => id === list[index + 1].id).commodityList
            });
        } else if (key === "Enter") getOrder();
    }

    useEffect(() => {
        status && setSelectData(initState);
    }, [status]);

    return (

        <div onKeyDown={handleHotKey} tabIndex="-1">
            <Modal
                visible={status}
                title="挂单查询"
                onCancel={closeModal}
                width={700}
                className={styled["cash-dialog-hangup"]}
                okText="取单"
                onOk={getOrder}
            >
                <OrderList
                    list={list}
                    selectType={selectType}
                    select={select}
                    clickSelect={clickSelect}
                />
                <OrderDetails data={currentData} wrapCss={styled["order-details"]} />
            </Modal>
        </div>
    );
}