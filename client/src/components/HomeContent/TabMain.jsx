import React from "react";
import { Card } from "antd";
import { connect } from "react-redux";
import style from "../../styles/system_main.scss"
import { openModuleAction, toggleCurrentModuleAction } from "../../redux/action";
import exampleImg from "../../styles/images/example-module.gif";

const { Meta } = Card;

function ModuleCard({ title, handleClick, status }) {
    return (
        <Card
            className={style["system-main-card"]}
            cover={<img alt="example" src={exampleImg} />}
            hoverable
            onClick={handleClick}
        >
            <Meta
                className={style["system-main-title"]}
                title={title}
            />
            <span style={{
                display: status ? "block" : "none"
            }}
                className={style["system-main-module-status"]}
            />
        </Card>
    );
}


function _TabMain({ modules, authority, openModule, toggleCurrentModule }) {
    const { current, moduleList } = modules;

    function handleModuleClick(module) {
        console.log(module);
        if (moduleList.includes(module)) {
            if (current !== module) toggleCurrentModule(module);
        } else {
            openModule(module);
        }
    }

    return (
        <div className={style["system-main"]}>
            {
                authority.filter(i => i !== "系统主页").map(auth =>
                    <ModuleCard
                        title={auth}
                        key={auth}
                        status={moduleList.includes(auth)}
                        handleClick={handleModuleClick.bind(null, auth)}
                    />)
            }
        </div>
    );
}

function tabMain_MapStateToProps(state) {
    return {
        modules: state.modules,
        authority: state.userDetails.authority
    }
}

function tabMain_MapDispatchToProps(dispatch) {
    return {
        openModule: (name) => dispatch(openModuleAction(name)),
        toggleCurrentModule: (name) => dispatch(toggleCurrentModuleAction(name))
    }
}

const TabMain = connect(
    tabMain_MapStateToProps,
    tabMain_MapDispatchToProps
)(_TabMain);

export {
    TabMain
}