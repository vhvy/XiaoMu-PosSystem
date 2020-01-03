import React, { useState } from "react";
import { Icon, Drawer, Switch } from "antd";
import { connect } from "react-redux";
import { toggleTabsStatusAction } from "../../../redux/action";
import config from "../../../config";

const { GLOBAL_TABS_STATUS } = config;

function _SettingDrawer({ show, hide, showTabs, toggleTabs }) {

    function handleChange(bool) {
        bool ? localStorage.removeItem(GLOBAL_TABS_STATUS) : localStorage.setItem(GLOBAL_TABS_STATUS, "hide");
        toggleTabs(bool);
    }

    return (
        <Drawer
            visible={show}
            onClose={hide}
        >
            <div>
                启用多标签:&nbsp;&nbsp;&nbsp;&nbsp;
                <Switch onChange={handleChange} checked={showTabs} />
            </div>
        </Drawer>
    );
}

function mapStateToProps(state) {
    const { showTabs } = state;
    return {
        showTabs
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleTabs: (bool) => dispatch(toggleTabsStatusAction(bool))
    }
}

const SettingDrawer = connect(mapStateToProps, mapDispatchToProps)(_SettingDrawer);

export function Setting() {

    const [show, setShow] = useState(false);


    function showDrawer() {
        setShow(true);
    }

    function hideDrawer() {
        setShow(false);
    }

    return (
        <>
            <Icon
                type="setting"
                onClick={showDrawer}
                style={{
                    fontSize: 18,
                    marginRight: 20,
                    cursor: "pointer"
                }} />
            <SettingDrawer show={show} hide={hideDrawer} />
        </>
    );
}
