import React from "react";
import config from "../config";
import { Icon } from "antd";

const { ICON_ONLINE_URL } = config;

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: ICON_ONLINE_URL
});

export function IconOnline({
    type,
    ...args
}) {

    return <IconFont type={type} {...args} />;
}