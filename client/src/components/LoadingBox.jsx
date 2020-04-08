import React from "react";
import styled from "../styles/components/loading-box.scss";
import { Spin } from "antd";

export function LoadingBox({
    status = true,
    tip = "加载中，请稍候...",
    spinProps = {},
    wrapCss,
    noPadding = false
}) {


    const wrapCssList = [styled["loading-wrap"]];

    noPadding && wrapCssList.push(styled["no-padding"]);

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