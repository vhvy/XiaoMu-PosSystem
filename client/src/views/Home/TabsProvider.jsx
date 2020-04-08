import React, { createContext, useContext, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    closeTabAction,
    openTabAction,
    toggleTabAction
} from "../../redux/action";

const TabsContext = createContext();
export const useTabs = () => useContext(TabsContext);

const selector = ({ tabs }) => {
    const { currentPath, openTabs } = tabs;
    return {
        currentPath,
        openTabs
    }
};

export function TabsProvider({
    children
}) {

    const dispatch = useDispatch();

    const {
        openTab,
        closeTab,
        toggleTab,
    } = useMemo(() => ({
        openTab: (value) => dispatch(openTabAction(value)),
        closeTab: (path) => dispatch(closeTabAction(path)),
        toggleTab: (path) => dispatch(toggleTabAction(path))
    }), [dispatch]);

    const {
        currentPath,
        openTabs
    } = useSelector(selector);

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