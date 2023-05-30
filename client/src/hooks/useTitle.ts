import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { routes } from "@/router/module";
import useLocale from "@/hooks/useLocale";

const createRouteLabelKeyMap = () => {

    const routeMap: Record<string, string> = {};

    for (const { path, navConfig: topNavConfig, children } of routes) {
        const topPath = path.replace("/*", "");

        if (topNavConfig) {
            routeMap[topPath] = topNavConfig.labelKey;
        } else {
            console.warn(`CAN'T FIND ${topPath} navConfig!!!`);
        }


        if (children && children.length) {
            children.filter(route => route.path !== "*")
                .forEach(({ path, navConfig }) => {
                    const fullPath = topPath + "/" + path;
                    if (navConfig) {
                        routeMap[fullPath] = navConfig.labelKey;
                    } else {
                        console.warn(`CAN'T FIND ${fullPath} navConfig!!!`);
                    }
                });
        }
    }

    return routeMap;
}

const getTopPath = (path: string) => {
    if (path === "/") return "/";

    return "/" + path.slice(1).split('/')[0];
}

const useTitle = () => {

    const { locale } = useLocale();
    const location = useLocation();

    const [routeLabelKeyMap] = useState(createRouteLabelKeyMap);

    type NavLabelKey = keyof typeof locale.NavLabel;

    const getPathTitle = (labelKey: NavLabelKey): string => {
        if (labelKey in locale.NavLabel) return locale.NavLabel[labelKey];
        console.warn(`CANNOT FIND ${labelKey} LABEL!!!`);
        return labelKey;
    }

    useEffect(() => {
        const { pathname } = location;
        const topPath = getTopPath(pathname);

        let titleList: string[] = [];

        const topPathLabelKey = routeLabelKeyMap[topPath];

        titleList.push(getPathTitle(topPathLabelKey as NavLabelKey));

        if (topPath !== pathname) {
            // 含有二级路由
            const subPathLabelKey = routeLabelKeyMap[pathname];
            titleList.push(getPathTitle(subPathLabelKey as NavLabelKey));
        }

        document.title = `${titleList.join("/")} - ${locale.AppName}`;

    }, [location, locale]);
}


export default useTitle;