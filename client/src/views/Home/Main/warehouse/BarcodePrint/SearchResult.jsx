import React from "react";
import styled from "../../../../../styles/warehouse/barcodeprint.scss";
import { GlobalList } from "./GlobalList";

export function SearchResult(props) {

    return (
        <GlobalList
            {...props}
            wrapCss={styled["search-result-wrap"]}
        />
    );
}