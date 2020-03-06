import React, { useState } from "react";
import { Layout } from "antd";
import { LeftSideMenu } from "./LeftSideMenu";
import { Header } from "./Header";
import { Main } from "./Main";
import { MultipleTabs } from "./MultipleTabs";
import { TabsProvider } from "./TabsProvider";
import { connect } from "react-redux";
import config from "../../config";

const { GLOBAL_SIDER_COLLAPSED } = config;

function _Home({ showTabs }) {
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


function mapStateToProps(state) {
    const { showTabs } = state;
    return {
        showTabs
    }
}

const Home = connect(mapStateToProps)(_Home);

export default Home;