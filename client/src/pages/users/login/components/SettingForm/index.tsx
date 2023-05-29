import { Ref, forwardRef, useMemo } from "react";
import { Button, Title3, Caption1 } from "@fluentui/react-components";

import XMForm, { FormItemType } from "@/components/XMForm";
import type { FormConfig } from "@/components/XMForm";

import useLocale from "@/hooks/useLocale";

import classes from "./index.module.scss";

type Props = {
    setLoginMode: () => void
}

const SettingForm = ({ setLoginMode }: Props, ref: Ref<HTMLFormElement>) => {

    const { locale } = useLocale();


    const settingFormConfig: FormConfig[] = useMemo(() => ([
        <Title3 as="h3" key={"h3"} block>{locale.Login.settingsTitle}</Title3>,
        {
            name: "server_address",
            fieldType: FormItemType.Input,
            label: locale.Login.Settings.serverAddress,
            customEle: (props) => <input {...props} />,
            props: {
                className: classes.login_field_input
            }
        },
        <Caption1 as="p" key={"example"} block>{locale.Login.Settings.addressExample}</Caption1>,
        (<div className={classes.login_btn_group} key={"btnGroup"}>
            <Button
                shape="square"
                onClick={setLoginMode}
            >
                {locale.Login.backToLoginPanelBtnText}
            </Button>
            <Button
                appearance="primary"
                shape="square"
            >
                {locale.Common.saveBtnText}
            </Button>
        </div>)
    ]), [locale]);

    return (
        <XMForm
            ref={ref}
            config={settingFormConfig}
            formClassName={classes.login_main_form}
        />
    );
}

export default forwardRef(SettingForm);