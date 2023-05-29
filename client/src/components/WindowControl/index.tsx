import classNames from "classnames";

import CodIcon from "@/components/CodIcon";

import classes from "./index.module.scss";

const WindowsControl = () => {

    return (
        <div className={classNames("flex")}>
            <div className={classNames("flex", "flex-center", classes.control_btn)}>
                <CodIcon icon="chrome-minimize" />
            </div>
            <div className={classNames("flex", "flex-center", classes.control_btn)}>
                <CodIcon icon="chrome-restore" />
            </div>
            <div className={classNames("flex", "flex-center", "close", classes.control_btn)}>
                <CodIcon icon="chrome-close" />
            </div>
        </div>
    );
}

export default WindowsControl;