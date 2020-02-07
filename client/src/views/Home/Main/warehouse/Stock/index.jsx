import React, { useState, useEffect } from "react";
import styled from "../../../../../styles/warehouse/stock.scss";
import { useAjax } from "../../../../AjaxProvider";
import { StockTasks } from "../../../../../tasks/stock";
import { StockRight } from "./StockRight";
import { StockList } from "./StockList";

export function Stock() {

    const ajax = useAjax();

    const [stockData, setStockData] = useState({
        list: [],
        selectId: -1,
        selectType: "origin"
    });
    // 订货单列表中

    const { list, selectId, selectType } = stockData;

    async function getStockList() {
        try {
            const { data } = await StockTasks.getAllStock(ajax);
            if (data.length !== 0) {
                setStockData(s => ({
                    ...s,
                    list: data,
                    selectId: data[0].id,
                    selectType: "origin"
                }));
            } else {
                setStockData(s => ({
                    ...s,
                    list: data,
                    selectId: -1,
                    selectType: "origin"
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleClickSelect(selectId) {
        setStockData(s => ({
            ...s,
            selectId,
            selectType: "click"
        }));
    }

    function addStock(data) {
        setStockData(s => ({
            ...s,
            selectId: data.id,
            selectType: "origin",
            list: [...s.list, data]
        }));
    }

    useEffect(() => {
        getStockList();
    }, []);

    const stockValue = list.find(i => i.id === selectId);
    const stock = stockValue && stockValue.date || -1;
    return (
        <div className={styled["stock-wrap"]}>
            <StockList list={list} selectId={selectId} selectType={selectType} handleClickSelect={handleClickSelect} />
            <StockRight addStock={addStock} stock={stock} />
        </div>
    );
}