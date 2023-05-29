import { ReactElement } from "react";
import classNames from "classnames";

import NavBar from "@/components/NavBar";
import SideNav from "@/components/SideNav";

import classes from "./index.module.scss";

type Props = {
    children?: ReactElement[] | ReactElement
};

const Layout = ({ children }: Props) => {
    return (
        <div className={classes.base_container}>
            <NavBar />
            <div className={classNames("flex", "flex-row", classes.base_main_container)}>
                <SideNav />
                <div className={classNames("flex-auto", classes.base_body_container)}>
                    {children}
                </div>
            </div>
        </div>
    )
};

export default Layout;