import React from "react";
import { Col } from "antd";
import { BarcodeInputAndTotal } from "./BarcodeInputAndTotal";
import { CashCommodity } from "./CashCommodity";
import { CashVipDetails } from "./CashVipDetails";
import styled from "../../../../../../styles/cash.scss";

export function CashLeft({
    vip,
    commodityList,
    select,
    selectType,
    clickSelect,
    value,
    setValue,
    addCommodity,
    hotkey,
    count,
    money
}) {



    return (
        <Col span={20} style={{
            flex: 1
        }} >
            <div className={styled["cash-left"]}>
                <BarcodeInputAndTotal
                    addCommodity={addCommodity}
                    value={value}
                    setValue={setValue}
                    hotkey={hotkey}
                    count={count}
                    money={money}
                />
                <CashCommodity
                    commodityList={commodityList}
                    select={select}
                    selectType={selectType}
                    clickSelect={clickSelect}
                    count={count}
                    money={money}
                />
                <CashVipDetails vip={vip} />
            </div>
        </Col>
    );
}