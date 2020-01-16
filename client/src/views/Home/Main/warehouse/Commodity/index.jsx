import React from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { SearchFn } from "./SearchFn";
import { Categories } from "./Categories";
import { CommodityList } from "./CommodityList";
import { EditForm } from "./EditForm";



export function Commodity() {
    return (
        <div className={styled["commodity-wrap"]}>
            <SearchFn />
            <div className={styled["bottom-wrap"]}>
                <Categories />
                <CommodityList />
            </div>
            <EditForm />
        </div>
    );
}