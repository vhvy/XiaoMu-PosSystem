import React from "react";
import { Layout, Icon, Typography, } from "antd";
import styled from "../../../styles/header.scss";
import { UserAvatar } from "./UserAvatar";
import { Setting } from "./Setting";

const { Header: AntdHeader } = Layout;
const { Title } = Typography;


export function Header({ collapsed, toggleCollapsed }) {
    return (
        <AntdHeader
            className={styled["header"]}
        >
            <div className={styled["header-left"]}>
                <Icon
                    className="trigger"
                    type={collapsed ? "menu-unfold" : "menu-fold"}
                    onClick={toggleCollapsed}
                />
                <Title level={4} className={styled["header-title"]}>小牧收银系统</Title>
            </div>
            <div className={styled["header-right"]}>
                <Setting />
                <UserAvatar />
            </div>
        </AntdHeader>
    );
}