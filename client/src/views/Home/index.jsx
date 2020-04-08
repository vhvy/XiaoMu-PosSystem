import React, { useState } from "react";
import { Layout } from "antd";
import { LeftSideMenu } from "./LeftSideMenu";
import { Header } from "./Header";
import { Main } from "./Main";
import { MultipleTabs } from "./MultipleTabs";
import { TabsProvider } from "./TabsProvider";
import { useSelector } from "react-redux";
import config from "../../config";

const selector = ({ showTabs }) => ({ showTabs });

const { GLOBAL_SIDER_COLLAPSED } = config;

export function Home() {

    const { showTabs } = useSelector(selector);

    const [collapsed, setCollapsed] = useState(
        localStorage.getItem(GLOBAL_SIDER_COLLAPSED) === "collapsed" ? true : false
    );

    function toggleCollapsed() {
        if (collapsed) {
            localStorage.removeItem(GLOBAL_SIDER_COLLAPSED);
        } else {
            localStorage.setItem(GLOBAL_SIDER_COLLAPSED, "collapsed");
        }
        setCollapsed(state => !state);
    }
    return (
        <Layout style={{ height: "100vh" }}>
            <TabsProvider>
                <LeftSideMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <Layout>
                    <Header collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                    {
                        showTabs && <MultipleTabs />
                    }
                    <Main />
                </Layout>
            </TabsProvider>
        </Layout>
    );
}

export default Home;