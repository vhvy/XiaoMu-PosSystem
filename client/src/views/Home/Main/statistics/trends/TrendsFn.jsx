import React from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { Select } from "antd";

const { Option } = Select;

export function TrendsFn({
    changeTimeBtn,
    typeList,
    setType,
    type
}) {


    return (
        <div className={styled["sales-fn-wrap"]}>
            {changeTimeBtn}
            <Select value={type} onChange={setType} className={styled["trends-type-wrap"]}>
                {
                    typeList.map(({ label, value }) => (
                        <Option
                            value={value}
                            key={value}
                        >
                            {label}
                        </Option>
                    ))
                }
            </Select>
        </div>
    );
}