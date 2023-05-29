import { Alert } from "@fluentui/react-components/unstable";
import { useEffect, useState, createRef, RefObject } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import classes from "./index.module.scss";
import EventBus from "@/utils/event";
import EventEnum from "@/constants/event";
import classNames from "classnames";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

export type NoticeType = 'info' | 'success' | 'error' | 'warning';

export interface NoticeConfig {
    message: string,
    type: NoticeType,
    timeout: number
}

interface NoticeInnerConfig extends Omit<NoticeConfig, "timeout"> {
    id: number | string,
    nodeRef: RefObject<HTMLDivElement>
}

const getId = (() => {
    let index = 0;
    return () => index++;
})();

const msgAnimationCss: CSSTransitionClassNames = {
    exit: classes.msg_fade_exit,
    exitActive: classes.msg_fade_active_exit,
    exitDone: classes.msg_fade_done_exit,

    enter: classes.msg_fade_enter,
    enterActive: classes.msg_fade_active_enter,
    enterDone: classes.msg_fade_done_enter
};

const getBoxOffsetSize = (index: number) => {
    return index * (44 + 16) + 16;
};


const Notice = () => {

    const [config, setConfig] = useState<NoticeInnerConfig[]>([]);


    useEffect(() => {
        const handler = ({ message, type, timeout }: NoticeConfig) => {
            const id = getId();

            setConfig(config => ([
                ...config,
                {
                    message,
                    type,
                    id,
                    nodeRef: createRef()
                },
            ]));

            setTimeout(() => {
                setConfig(config => config.filter(i => i.id !== id));
            }, timeout);
        };

        EventBus.subscribe(EventEnum.NOTICE, handler);

        return () => EventBus.removeSubscribe(EventEnum.NOTICE, handler);
    }, []);

    return (<TransitionGroup>
        {
            config.map(({ message, type, id, nodeRef }, index) => {
                return (
                    <CSSTransition key={id} nodeRef={nodeRef} timeout={300} classNames={msgAnimationCss} unmountOnExit>
                        <div ref={nodeRef} style={{ top: `${(getBoxOffsetSize(index))}px` }} className={classNames("fixed", classes.alert_box)}>
                            <Alert className={classes.alert_content} intent={type}>{message}</Alert>
                        </div>
                    </CSSTransition>
                );
            })
        }
    </TransitionGroup>);
}

export default Notice;