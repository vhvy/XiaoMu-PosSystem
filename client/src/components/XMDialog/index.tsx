import { Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Button } from "@fluentui/react-components";
import { useEffect, useState } from "react";

import EventEnum from "@/constants/event";
import EventBus from "@/utils/event";
import useLocale from "@/hooks/useLocale";

export interface DialogConfig {
    title: string,
    content: string,
    okText?: string,
    cancelText?: string,
    onOk?: Function,
    onCancel?: Function
}

const getId = (() => {
    let index = 0;
    return () => index++;
})();

interface DialogInnerConfig extends DialogConfig {
    id: number
}


const XMDialog = () => {

    const [configList, setConfigList] = useState<DialogInnerConfig[]>([]);

    const { locale } = useLocale();

    useEffect(() => {
        const handler = (config: DialogConfig) => {
            setConfigList(configList => [...configList, {
                ...config,
                id: getId()
            }]);
        };

        EventBus.subscribe(EventEnum.DIALOG, handler);

        return () => EventBus.removeSubscribe(EventEnum.DIALOG, handler);
    }, []);

    const handleRemoveDialogConfig = (index: number) => {
        setConfigList(configList => configList.filter((i, idx) => idx !== index));
    }

    const handleCancel = (index: number) => {
        const config = configList[index];
        try {
            config.onCancel?.();
        } catch { }
        handleRemoveDialogConfig(index);
    }

    const handleConfirm = (index: number) => {
        const config = configList[index];
        try {
            config.onOk?.();
        } catch { }
        handleRemoveDialogConfig(index);
    }

    return (
        <>
            {
                configList.map((config, index) => {
                    return (
                        <Dialog key={config.id} defaultOpen modalType="alert">
                            <DialogSurface>
                                <DialogBody>
                                    <DialogTitle>{config.title}</DialogTitle>
                                    <DialogContent>{config.content}</DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => handleCancel(index)} shape="square">{config.cancelText || locale.Common.cancelBtnText}</Button>
                                        <Button onClick={() => handleConfirm(index)} appearance="primary" shape="square">{config.okText || locale.Common.okText}</Button>
                                    </DialogActions>
                                </DialogBody>
                            </DialogSurface>
                        </Dialog>
                    );
                })
            }
        </>
    );
};


export default XMDialog;