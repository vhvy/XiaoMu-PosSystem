import React, { useState } from "react";
import { Icon, Drawer, Switch } from "antd";
import { connect } from "react-redux";
import {
    toggleTabsStatusAction,
    toggleCashHotKeyStatusAction,
} from "../../../redux/action";
import config from "../../../config";

const { GLOBAL_TABS_STATUS, GLOBAL_CASH_HOTKEY_SHOW } = config;


function CustomSwitch({
    status,
    label,
    toggleFn
}) {
    return (
        <div>
            {label}:&nbsp;&nbsp;&nbsp;&nbsp;
                <Switch onChange={toggleFn} checked={status} />
        </div>
    );
}

function _SettingDrawer({
    show,
    hide,
    showTabs,
    toggleTabs,
    showCashHotKey,
    toggleCashHotKey
}) {

    function toggleMulitTabs(bool) {
        bool ? localStorage.removeItem(GLOBAL_TABS_STATUS) : localStorage.setItem(GLOBAL_TABS_STATUS, "hide");
        toggleTabs(bool);
    }

    function toggleCashHotKeyStatus(bool) {
        bool ? localStorage.removeItem(GLOBAL_CASH_HOTKEY_SHOW) : localStorage.setItem(GLOBAL_CASH_HOTKEY_SHOW, "hide");
        console.log(bool);
        toggleCashHotKey(bool);
    }

    return (
        <Drawer
            visible={show}
            onClose={hide}
        >
            <CustomSwitch label="启用多标签" status={showTabs} toggleFn={toggleMulitTabs} />
            <CustomSwitch label="启用热键列表" status={showCashHotKey} toggleFn={toggleCashHotKeyStatus} />
        </Drawer>
    );
}

function mapStateToProps(state) {
    const { showTabs, showCashHotKey } = state;
    return {
        showTabs,
        showCashHotKey
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleTabs: (bool) => dispatch(toggleTabsStatusAction(bool)),
        toggleCashHotKey: (bool) => dispatch(toggleCashHotKeyStatusAction(bool))
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
