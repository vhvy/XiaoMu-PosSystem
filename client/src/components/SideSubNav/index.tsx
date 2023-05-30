import { Body1 } from "@fluentui/react-components";
import classNames from "classnames";
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { routes } from "@/router/module";
import type { Route } from "@/router/utils";
import useLocale from "@/hooks/useLocale";

import classes from "./index.module.scss";

const SideSubNav = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { locale } = useLocale();

    type NavLabelKey = keyof typeof locale.NavLabel;

    const getNavLabelText = (labelKey: NavLabelKey): string => {
        if (labelKey in locale.NavLabel) return locale.NavLabel[labelKey];
        return labelKey;
    }

    const subRoutes = useMemo(() => {
        const currentTopPath = location.pathname.slice(1).split("/")[0];

        for (const { path, children } of routes) {
            const routeTopPath = path.slice(1).split("/")[0];
            if (routeTopPath === currentTopPath) {
                if (children) {
                    return children.filter(i => i.path !== "*");
                } else {
                    return [];
                }
            }
        }

        return [];
    }, [location]);

    const activeIndex = useMemo(() => {
        if (!subRoutes.length) return 0;

        const currentSubPath = location.pathname.slice(1).split("/")[1];

        for (let i = 0; i < subRoutes.length; i++) {
            const { path } = subRoutes[i];
            if (currentSubPath === path) return i;
        }

        console.warn("CANNOT FIND SUB NAV INDX!!!");

        return 0;
    }, [location, subRoutes]);

    const handleSubNavClick = (route: Route) => {
        const currentSubPath = location.pathname.slice(1).split("/")[1];
        currentSubPath !== route.path && navigate(route.path);
    }

    if (!subRoutes.length) return null;

    return (
        <div className={classes.side_sub_nav}>
            <ul className={classNames("relative", classes.sub_nav_list)} style={{ "--active-index": activeIndex }}>
                {
                    subRoutes.map((route, index) => {
                        return (
                            <li key={index} className={classNames("flex", "flex-align-center", "relative", "pointer", classes.sub_nav_item)} onClick={() => handleSubNavClick(route)}>
                                <Body1>{getNavLabelText(route.navConfig?.labelKey as NavLabelKey)}</Body1>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default SideSubNav;