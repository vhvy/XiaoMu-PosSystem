import React from "react";
import { connect } from "react-redux";
import { Layout, Tabs } from "antd";
import style from "../../styles/home.scss";
import { TabFrontCash } from "./TabFrontCash";
import { TabMain } from "./TabMain";
import { TabStorageManage } from "./TabStorageManage";
import { openModuleAction, closeModuleAction, toggleCurrentModuleAction } from "../../redux/action";

const { Content } = Layout;
const { TabPane } = Tabs;


const TabList = {
    "系统主页": TabMain,
    "前台销售": TabFrontCash,
    "仓储管理": TabStorageManage
}


function _HomeContent({ modules, closeModule, toggleCurrentModule }) {
    const { current, moduleList } = modules;

    function handleTabClick(e) {
        if (e !== current) toggleCurrentModule(e);
    }

    function handleEditTab(e) {
        closeModule(e);
    }

    return (
        <Layout className={style["home-content"]}>
            <Content>
                <Tabs
                    activeKey={current}
                    tabBarGutter={10}
                    hideAdd
                    type="editable-card"
                    onTabClick={handleTabClick}
                    onEdit={handleEditTab}
                >
                    {
                        moduleList.map(m => {
                            const Content = TabList[m];
                            return (
                                <TabPane
                                    key={m}
                                    tab={m}
                                    closable={!(m === "系统主页")}
                                >
                                    <Content />
                                </TabPane>
                            );
                        })
                    }
                </Tabs>
            </Content>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        modules: state.modules
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closeModule: (name) => dispatch(closeModuleAction(name)),
        toggleCurrentModule: (name) => dispatch(toggleCurrentModuleAction(name))
    };
}

const HomeContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(_HomeContent);

export {
    HomeContent
};