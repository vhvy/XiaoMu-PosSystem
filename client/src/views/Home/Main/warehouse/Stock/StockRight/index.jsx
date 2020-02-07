import React, { useState } from "react";
import styled from "../../../../../../styles/warehouse/stock.scss";
import { StockCommodityList } from "./StockCommodityList";
import { StockFn } from "./StockFn";

export function StockRight({ addStock, stock }) {

    const [rightType, setRightType] = useState("details");
    // 右侧界面为新增订单模式或展示模式
    // 1.  details  展示模式
    // 2.  add      新增模式

    return (
        <div className={styled["stock-right"]}>
            <StockFn
                type={rightType}
                toggleType={setRightType}
                addStock={addStock}
            />
            <StockCommodityList
                type={rightType}
                stock={stock}
            />
        </div>
    );
}