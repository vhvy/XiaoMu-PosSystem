import React from "react";
import styled from "../styles/components/loading-box.scss";
import { Spin } from "antd";

export function LoadingBox({
    status = false,
    tip = "加载中，请稍候...",
    spinProps = {},
    wrapCss
}) {


    const wrapCssList = [styled["loading-wrap"]];

    status && wrapCssList.push(styled["show"]);

    wrapCss && wrapCssList.push(wrapCss);

    return (
        <div
            className={wrapCssList.join(" ")}
        >
            <Spin
                size="large"
                tip={tip}
                {...spinProps}
            />
        </div>
    );
}