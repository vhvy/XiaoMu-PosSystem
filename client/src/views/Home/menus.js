import { Cash } from "./Main/market/Cash";
import { Device } from "./Main/market/Device";

import { Supplier } from "./Main/warehouse/Supplier";
import { Commodity } from "./Main/warehouse/Commodity";
import { Stock } from "./Main/warehouse/Stock";

import { Vip } from "./Main/vip";
import { VipSetting } from "./Main/vip/Setting";

import { UserManage } from "./Main/users";

import { DataExport } from "./Main/system/data/Export";
import { DataImport } from "./Main/system/data/Import";

import { PromotionCommodityManage } from "./Main/promotion/Commodity";
import { Promotion } from "./Main/promotion/Manage";

import { Orders } from "./Main/statistics/orders";
import { Proportion } from "./Main/statistics/proportion";
import { Trends } from "./Main/statistics/trends";

export const menus = [
    {
        title: "系统主页",
        path: "/home",
        icon: "home",
        permission: false
    },
    {
        title: "前台销售",
        path: "/home/market",
        icon: "shop",
        permission: false,
        component: Cash
    },
    {
        title: "促销管理",
        path: "/home/promotion",
        icon: "icon-cuxiaohuodong",
        icon_online: true,
        children: [
            {
                title: "活动管理",
                path: "/home/promotion/manage",
                component: Promotion
            },
            {
                title: "活动商品管理",
                path: "/home/promotion/commodity",
                component: PromotionCommodityManage
            }
        ]
    },
    {
        title: "仓储管理",
        path: "/home/warehouse",
        icon: "icon-cangkuguanli",
        icon_online: true,
        children: [
            {
                title: "供应商管理",
                path: "/home/warehouse/supplier",
                component: Supplier
            },
            {
                title: "进货管理",
                path: "/home/warehouse/stock",
                component: Stock
            },
            {
                title: "商品管理",
                path: "/home/warehouse/commodity",
                component: Commodity
            },
            {
                title: "标签打印",
                path: "/home/warehouse/barcodeprint"
            }
        ]
    },
    {
        title: "会员管理",
        path: "/home/vip",
        icon: "icon-huiyuan-",
        icon_online: true,
        children: [
            {
                title: "会员管理",
                path: "/home/vip/manage",
                component: Vip
            },
            {
                title: "高级功能",
                path: "/home/vip/setting",
                component: VipSetting
            }
        ]
    },
    {
        title: "数据统计",
        path: "/home/statistics",
        icon: "pie-chart",
        children: [
            {
                title: "订单明细",
                path: "/home/statistics/orders",
                component: Orders
            },
            {
                title: "占比分析",
                path: "/home/statistics/proportion",
                component: Proportion
            },
            {
                title: "趋势分析",
                path: "/home/statistics/trends",
                component: Trends
            }
        ]
    },
    {
        title: "用户管理",
        path: "/home/users",
        icon: "user",
        component: UserManage
    },
    {
        title: "数据管理",
        path: "/home/data",
        icon: "database",
        children: [
            {
                title: "商品导入",
                path: "/home/data/import",
                component: DataImport
            },
            {
                title: "数据导出",
                path: "/home/data/export",
                component: DataExport
            },
        ]
    },
    {
        title: "设备管理",
        path: "/home/device",
        icon: "printer",
        component: Device
    },
    {
        title: "系统设置",
        path: "/home/system",
        icon: "setting",
        children: [
            {
                title: "店铺信息",
                path: "/home/system/store"
            }
        ]
    }
];

export const menuValue = (() => {
    const menuMap = {};
    const router = [];
    const menuPath = menus.reduce((result, { path, children, title, component }) => {
        if (children) {
            let parentPath = path;
            children.map(({ path, title, component }) => {
                result.push([path, parentPath]);
                menuMap[path] = title;
                router.push({
                    path,
                    component
                });
            });
        } else {
            result.push([path]);
            menuMap[path] = title;
            router.push({
                path,
                component
            });
        }
        return result;
    }, []);
    return {
        menuMap, menuPath, router
    }
})();