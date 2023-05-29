import { useRef, useState } from "react";
import { Subtitle2, Body1 } from "@fluentui/react-components";
import { LauncherSettingsRegular } from "@fluentui/react-icons";
import classNames from "classnames";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import type { CSSTransitionClassNames } from "react-transition-group/CSSTransition";


import LoginForm from "./components/LoginForm";
import SettingForm from "./components/SettingForm";

import useLocale from "@/hooks/useLocale";

import classes from "./index.module.scss";



const loginAnimationCss: CSSTransitionClassNames = {
    appear: classes.login_fade_appear,
    appearActive: classes.login_fade_active_appear,
    appearDone: classes.login_fade_done_appear,

    exit: classes.login_fade_exit,
    exitActive: classes.login_fade_active_exit,
    exitDone: classes.login_fade_done_exit,

    enter: classes.login_fade_enter,
    enterActive: classes.login_fade_active_enter,
    enterDone: classes.login_fade_done_enter
};

export default () => {

    const { locale } = useLocale();

    const [isLoginMode, setIsLoginMode] = useState(true);

    const barNodeRef = useRef<HTMLDivElement>(null as never);
    const mainNodeRef = useRef<HTMLDivElement>(null as never);


    return (
        <div className={classNames("flex", "flex-column", "flex-center", classes.login_main)}>
            <div className={classes.login_body}>
                <Subtitle2 as="h2" block className={classes.logo_title}>{locale.AppName}</Subtitle2>
                <SwitchTransition>
                    <CSSTransition<HTMLDivElement>
                        key={isLoginMode as never}
                        nodeRef={mainNodeRef}
                        timeout={250}
                        classNames={loginAnimationCss}
                        appear
                    >
                        {
                            isLoginMode ?
                                (<div className="relative" ref={mainNodeRef}><LoginForm /></div>)
                                :
                                (<div ref={mainNodeRef} className={classNames("relative", classes.login_setting_panel)}><SettingForm setLoginMode={() => setIsLoginMode(true)} /></div>)
                        }
                    </CSSTransition>
                </SwitchTransition>
            </div>
            <CSSTransition
                nodeRef={barNodeRef}
                in={isLoginMode}
                timeout={250}
                classNames="fade"
                unmountOnExit
            >
                <div
                    className={classNames("pointer", "flex", "flex-align-center", classes.login_advanced_settings_bar)}
                    onClick={() => setIsLoginMode(false)}
                    ref={barNodeRef}
                >
                    <LauncherSettingsRegular />
                    <Body1 className={classNames(classes.login_advanced_settings_bar_text)}>{locale.Login.advancedSettingsBarText}</Body1>
                </div>
            </CSSTransition>
        </div>
    );
}