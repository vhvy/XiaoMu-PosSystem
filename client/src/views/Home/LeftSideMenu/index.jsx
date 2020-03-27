import React, { useEffect } from "react";
import { Layout, Menu, Icon } from "antd";
import { menus, menuValue } from "../menus";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { useTabs } from "../TabsProvider";
import { IconOnline } from "../../../components/IconOnline";
import logo from "../../../styles/images/logo.png";
import styled from "../../../styles/sidemenu.scss";

const { menuMap, menuPath } = menuValue;

const { SubMenu, Item } = Menu;
const { Sider } = Layout;

function CustomIcon(icon, online, title) {
    return (
        <span>
            {online ? <IconOnline type={icon} /> : <Icon type={icon} />}
            {title ? <span>{title}</span> : ""}
        </span>
    );
}


export function LeftSideMenu({ collapsed }) {
    const { tabs, handleTab } = useTabs();
    const { currentPath } = tabs;

    const history = useHistory();
    const location = useLocation();
    const { isAdmin } = useAuth();

    useEffect(() => {
        const { pathname: path } = location;
        handleTab({
            title: menuMap[path],
            path
        });

    }, [location]);
    const selectedKeys = menuPath.find(p => p[0] === currentPath);

    function handleMenuClick({ key, item }) {
        /**
         * 如果在这里处理tab，页面的前进后退事件就无法处理了
         * 将处理tab的逻辑放在useEffect里，后果就是会多触发一次更新，性能影响不大
         * 暂时没想到更好的办法，待后续完善吧。
         */
        // const text = item.node.innerText;
        if (location.pathname !== key) {
            history.push(key);
            // handleTab({
            //     title: text,
            //     path: key
            // });
        }
    }

    function renderItem(items) {
        return (
            items.filter(
                ({ permission = true }) => !permission || isAdmin)
                .map(({ title, path, icon, icon_online, children }) => {
                    if (children) {
                        return (
                            <SubMenu
                                key={path}
                                title={CustomIcon(icon, icon_online, title)}
                            >
                                {renderItem(children)}
                            </SubMenu>
                        );
                    }
                    return (
                        <Item key={path}>
                            {icon ? CustomIcon(icon, icon_online, title) : title}
                        </Item>
                    );
                })
        );
    }
    
    return (
        <Sider
            trigger={null}
            theme="light"
            collapsed={collapsed}
        >
            <div
                className={styled["logo-wrap"]}
                style={{
                    backgroundImage: `url(${logo})`
                }}
            >
                <p>小牧收银系统</p>
            </div>
            <Menu
                style={{
                    border: "none",
                    overflowX: "hidden",
                    overflowY: "auto",
                    height: "calc(100% - 76px)",
                    userSelect: "none"
                }}
                theme="light"
                mode="inline"
                selectedKeys={selectedKeys}
                onClick={handleMenuClick}
            >
                {
                    renderItem(menus)
                }
            </Menu>
        </Sider>
    );
}