import React, { useMemo } from "react";
import styled from "../../../../../../styles/warehouse/stock.scss";
import { useSelector, useDispatch } from "react-redux";
import {
    VirtualSelectList,
    VirtualSelectListFooter,
    VirtualSelectListHeader,
    createRenderItemFn
} from "../../../../../../components/VirtualSelectList";
import {
    setWareStockSelectAction,
    cleanWareStockAction,
    initWareStockAction
} from "../../../../../../redux/action";
import { mathc } from "../../../../../../tools/mathc";
import { useEffect } from "react";
import { StockTasks } from "../../../../../../tasks/stock";
import { useAjax } from "../../../../../AjaxProvider";

const selector = ({ warehouse }) => ({
    ...warehouse.stock
});

const columns = [
    {
        title: "序号",
        key: "index",
        type: 5
    },
    {
        title: "条码",
        key: "barcode",
        type: 2
    },
    {
        title: "名称",
        key: "name",
        type: 2
    },
    {
        title: "数量",
        key: "count",
        type: 3
    },
    {
        title: "进价",
        key: "in_price",
        type: 3
    }
];

const getFooterColumns = (data) => {

    let count_sum = 0, in_price_sum = 0;

    data.map(({ count, in_price }) => {
        count_sum = mathc.add(count_sum, count);
        in_price_sum = mathc.add(in_price_sum, mathc.multiply(in_price, count));
    });

    return [
        {
            title: "共计",
            value: data.length || 0
        },
        {
            title: "SPACE",
            type: 2,
            value: ""
        },
        {
            title: "SPACE2",
            type: 2,
            value: ""
        },
        {
            title: "count",
            type: 3,
            value: count_sum
        },
        {
            title: "in_price",
            type: 3,
            value: in_price_sum
        }
    ];
};

export function StockCommodityList({ type, stock }) {

    const ajax = useAjax();

    const { list, selectId, selectType } = useSelector(selector);

    const dispatch = useDispatch();

    function handleClickSelect(selectId) {
        dispatch(setWareStockSelectAction({
            selectType: "click",
            selectId
        }));
    }

    const Header = useMemo(() => (
        <VirtualSelectListHeader data={columns} />
    ), []);

    const Footer = useMemo(() => (
        <VirtualSelectListFooter data={getFooterColumns(list)} />
    ), [list]);

    const renderItem = useMemo(() => (
        createRenderItemFn(columns, handleClickSelect)
    ), []);

    function toogleAddMode() {
        dispatch(cleanWareStockAction());
    }

    async function getStockDetails(id) {
        if (id === -1) return;
        try {
            const { data } = await StockTasks.getStockDetails(ajax, id);
            const list = data.map(i => ({
                ...i,
                name: i.commodity_name
            }));
            dispatch(initWareStockAction(list));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (type === "add") {
            toogleAddMode();
        } else {
            getStockDetails(stock);
        }
    }, [type]);

    useEffect(() => {
        if (type === "details") {
            getStockDetails(stock);
        }
    }, [stock]);

    return (
        <VirtualSelectList
            wrapCss={styled["stock-commodity-list"]}
            header={Header}
            footer={Footer}
            select={selectId}
            selectType={selectType}
            data={list}
            renderItem={renderItem}
        />
    );
}