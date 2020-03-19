import React from "react";
import styled from "../../../../../styles/warehouse/barcodeprint.scss";
import { GlobalList } from "./GlobalList";

export function CommodityList(props) {

    return (
        <GlobalList
            {...props}
            wrapCss={styled["commodity-list-wrap"]}
        />
    );
}