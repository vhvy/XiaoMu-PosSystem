import {
    TABS_ADD_TAB,
    TABS_CLOSE_TAB,
    TABS_SET_CURRENT_TAB,
    CLEAR_USER_STATE,
    TOGGLE_TABS_STATUS
} from "../action/actionType";
import config from "../../config";

const { GLOBAL_TABS_STATUS } = config;

const defaultTabsStatus = localStorage.getItem(GLOBAL_TABS_STATUS) === "hide" ? false : true;

export function showTabs(state = defaultTabsStatus, action) {
    switch (action.type) {
        case TOGGLE_TABS_STATUS:
            return action.status;
        default:
            return state;
    }
}

const fakeopenTabs = [
    {
        path: '/home',
        title: '系统主页'
    },
    {
        title: '活动管理',
        path: '/home/promotion/manage'
    },
    {
        title: '活动商品管理',
        path: '/home/promotion/commodity'
    },
    {
        title: '供应商管理',
        path: '/home/warehouse/supplier'
    },
    {
        title: '进货管理',
        path: '/home/warehouse/stock'
    },
    {
        title: '分类管理',
        path: '/home/warehouse/categories'
    },
    {
        title: '商品管理',
        path: '/home/warehouse/commodity'
    }
];

const initValue = {
    currentPath: "/home",
    // openTabs: fakeopenTabs
    openTabs: [
        {
            path: "/home",
            title: "系统主页"
        }
    ]
};

export function tabs(state = initValue, action) {
    const { currentPath, openTabs } = state;
    switch (action.type) {
        case CLEAR_USER_STATE:
            // 如果用户退出登录则恢复初始化值
            return initValue;
        case TABS_SET_CURRENT_TAB:
            return {
                currentPath: action.path,
                openTabs
            };
        case TABS_ADD_TAB:
            return {
                currentPath: action.value.path,
                openTabs: [...openTabs, action.value]
            };
        case TABS_CLOSE_TAB:
            return (() => {
                const { path } = action;
                if (path === currentPath) {
                    // 如果要关闭的是当前tab
                    const index = openTabs.findIndex(t => t.path === path);
                    if (index + 1 === openTabs.length) {
                        // 如果要关闭的tab是最后一个tab，那么切换当前tab到前一个tab
                        return {
                            currentPath: openTabs[openTabs.length - 2].path,
                            openTabs: openTabs.slice(0, index)
                        };
                    } else {
                        // 如果要关闭的tab后面还有tab，那么切换当前tab为下一个tab
                        return {
                            currentPath: openTabs[index + 1].path,
                            openTabs: openTabs.filter(t => t.path !== path)
                        }
                    }
                } else {
                    // 如果关闭的不是当前tab
                    return {
                        currentPath,
                        openTabs: openTabs.filter(t => t.path !== path)
                    }
                }
            })();
        default:
            return state;
    }
}