import { useMemo, useState } from "react";
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip, makeStyles, tokens } from "@fluentui/react-components";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";

import CodIcon from "@/components/CodIcon";
import { routes } from "@/router/module";
import useLocale from "@/hooks/useLocale";
import useDialog from "@/hooks/useDialog";
import useAuth from "@/hooks/useAuth";
import useMsg from "@/hooks/useMsg";
import type { Route } from "@/router/utils";

import classes from "./index.module.scss";


const useStyles = makeStyles({
    nav_item: {
        fontSize: tokens.fontSizeBase100,
        lineHeight: tokens.lineHeightBase100
    }
});

const SideNav = () => {

    const [config] = useState(() => routes
        .filter(route => {
            if (route.navConfig?.showSideNav === false) return false;
            return true;
        })
        .sort((a, b) => {
            if (!a.navConfig || !b.navConfig) return 0;
            if (a.navConfig.sort === undefined || b.navConfig.sort === undefined) return 0;
            return a.navConfig.sort < b.navConfig!.sort ? -1 : 1;
        })
    );

    const { handleLogout } = useAuth();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const location = useLocation();
    const styles = useStyles();
    const Dialog = useDialog();
    const Message = useMsg();

    type NavLabelKey = keyof typeof locale.NavLabel;

    const getNavLabelText = (labelKey: NavLabelKey): string => {
        if (labelKey in locale.NavLabel) return locale.NavLabel[labelKey];
        return labelKey;
    }


    const activeIndex = useMemo(() => {
        const currentTopPath = location.pathname.slice(1).split("/")[0];

        for (let i = 0; i < config.length; i++) {
            const { path } = config[i];
            const routeTopPath = path.slice(1).split("/")[0];
            if (routeTopPath === currentTopPath) return i;
        }
        console.warn("CANNOT FIND NAV INDEX!!!!");
        return 0;
    }, [location]);

    const getNavItemCss = (index: number) => {
        return classNames("flex", "flex-column", "flex-center", "pointer", { "active": index === activeIndex }, classes.nav_item, styles.nav_item);
    }

    const getPath = (nav: Route) => {
        if (nav.children && nav.children.length) {
            const defaultSubRoute = nav.children.find(i => !!i.index);
            let childPath = defaultSubRoute ? defaultSubRoute.path : nav.children[0].path;

            return (nav.path + childPath).replace("*", "");
        }

        return nav.path;
    }

    const handleNavClick = (nav: Route) => {
        const path = getPath(nav);
        navigate(path);
    }

    const handleConfirmSignOut = () => {
        Dialog.confirm({
            title: locale.Common.promptTitle,
            content: locale.NavUserMenu.signOutDialogContent,
            onOk: () => {
                handleLogout();
                Message.success(locale.NavUserMenu.signOutSuccessPrompt);
            }
        });
    }


    return (
        <nav className={classNames("flex", "flex-column", classes.side_nav_container)}>
            <div className={classNames("relative", classes.side_nav_inner_container)} style={{ '--active-index': activeIndex }}>
                {
                    config.map((nav, index) => {
                        return (
                            <div key={nav.path} className={getNavItemCss(index)} onClick={() => handleNavClick(nav)}>
                                {nav.navConfig?.icon}
                                <span className={classNames(styles.nav_item, classes.nav_item_label)}>
                                    {getNavLabelText(nav.navConfig!.labelKey as NavLabelKey)}
                                </span>
                            </div>
                        );
                    })
                }
            </div>
            <div className={classNames("flex", "flex-center", "pointer", classes.nav_user_btn)}>
                <Menu positioning="after-bottom">
                    <MenuTrigger disableButtonEnhancement>
                        <Tooltip content={locale.NavLabel.user} relationship="label" positioning="after" showDelay={0} withArrow>
                            <div className={classNames("text-center", classes.user_btn_box)}>
                                <CodIcon icon="account" className={classes.user_btn} />
                            </div>
                        </Tooltip>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItem onClick={handleConfirmSignOut}>{locale.NavUserMenu.signOut}</MenuItem>
                            <MenuItem>{locale.NavUserMenu.accountInfo}</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </div>
        </nav>
    );
}

export default SideNav;