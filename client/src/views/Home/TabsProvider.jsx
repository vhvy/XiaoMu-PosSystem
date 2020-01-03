import React, { createContext, useContext } from "react";
import { connect } from "react-redux";
import {
    closeTabAction,
    openTabAction,
    toggleTabAction
} from "../../redux/action";

const TabsContext = createContext();
export const useTabs = () => useContext(TabsContext);

function _TabsProvider({
    currentPath,
    openTabs,
    openTab,
    closeTab,
    toggleTab,
    children
}) {

    function handleTab(value) {
        const { path } = value;
        if (openTabs.find(t => t.path === path)) {
            toggleTab(path);
        } else {
            openTab(value);
        }
    }
    const value = {
        tabs: {
            currentPath,
            openTabs
        },
        handleTab,
        closeTab,
    };
    return <TabsContext.Provider value={value} children={children} />
}

function mapStateToProps(state) {
    const { currentPath, openTabs } = state.tabs;
    return {
        currentPath,
        openTabs
    }
}

function mapDispatchToProps(dispatch) {
    return {
        openTab: (value) => dispatch(openTabAction(value)),
        closeTab: (path) => dispatch(closeTabAction(path)),
        toggleTab: (path) => dispatch(toggleTabAction(path))
    }
}

export const TabsProvider = connect(mapStateToProps, mapDispatchToProps)(_TabsProvider);