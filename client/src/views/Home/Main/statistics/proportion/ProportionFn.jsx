import React from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { Cascader } from "antd";

export function ProportionFn({
    changeTimeBtn,
    currentType,
    option,
    setCurrentType
}) {


    return (
        <div className={styled["sales-fn-wrap"]}>
            {changeTimeBtn}
            <Cascader
                className={styled["select-type-wrap"]}
                value={currentType}
                options={option}
                allowClear={false}
                expandTrigger="hover"
                onChange={setCurrentType}
                placeholder="请选择分析类型"
            />
        </div>
    );
}