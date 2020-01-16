import React from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { Input } from "antd";

const { Search } = Input;
export function SearchFn() {

    return (
        <div className={styled["search"]}>
            <Search placeholder="请在此输入要查询的商品" />
        </div>
    );
}