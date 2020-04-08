import React from "react";
import { Layout, Icon, Typography, } from "antd";
import styled from "../../../styles/header.scss";
import { UserAvatar } from "./UserAvatar";
import { Setting } from "./Setting";
import { useSelector } from "react-redux";

const { Header: AntdHeader } = Layout;
const { Title } = Typography;

const selector = ({ store_name }) => store_name;


export function Header({ collapsed, toggleCollapsed }) {

    const store_name = useSelector(selector);

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
                <Title level={4} className={styled["header-title"]}>{store_name}</Title>
            </div>
            <div className={styled["header-right"]}>
                <Setting />
                <UserAvatar />
            </div>
        </AntdHeader>
    );
}