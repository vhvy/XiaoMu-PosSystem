import classNames from "classnames";
import { makeStyles, tokens } from "@fluentui/react-components";

import WindowsControl from "@/components/WindowControl";
import useLocale from "@/hooks/useLocale";

import classes from "./index.module.scss";

const useStyles = makeStyles({
    title: {
        fontSize: tokens.fontSizeBase200
    }
});

const NavBar = () => {

    const { locale } = useLocale();

    const styles = useStyles();

    return (
        <div className={classNames("flex", classes.nav_bar)}>
            <div className={classes.nav_left}></div>
            <p className={classNames("flex", "flex-center", classes.nav_center, styles.title)}>{locale.AppName}</p>
            <div className={classNames("flex", "flex-justify-end", classes.nav_right)}>
                <WindowsControl />
            </div>
        </div>
    );
}

export default NavBar;