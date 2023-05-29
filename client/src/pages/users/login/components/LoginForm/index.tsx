import { useMemo, Ref, forwardRef } from "react";
import classNames from "classnames";
import { Button, makeStyles, typographyStyles, Link, Title3, Spinner } from "@fluentui/react-components";
import { Navigate, useLocation } from "react-router-dom";

import XMForm, { FormItemType, FormConfig } from "@/components/XMForm";
import useLocale from "@/hooks/useLocale";
import { usePost } from "@/hooks/useHttp";
import useMsg from "@/hooks/useMsg";
import useAuth from "@/hooks/useAuth";

import apiPath from "@/constants/apiPath";
import { getValidationErrors } from "@/utils/error";
import { LoginSuccessPayload } from "@/provider/AuthProvider";
import { getUrlParamsObj } from "@/utils/index";

import classes from "./index.module.scss";

const useStyles = makeStyles({
    body: typographyStyles.body1
});

type Props = {}

const LoginForm = ({ }: Props, ref: Ref<HTMLFormElement>) => {

    const styles = useStyles();
    const { locale } = useLocale();
    const Message = useMsg();
    const { handleLoginSuccess, isLogin } = useAuth();
    const location = useLocation();

    interface LoginFormData {
        account: string,
        password: string
    }

    type LoginData = LoginFormData;

    type LoginResponse = LoginSuccessPayload;


    const { data, error, trigger, isMutating: isLoading } = usePost<LoginResponse, Error, LoginData>(apiPath.LOGIN_URL);

    const loginFormConfig: FormConfig[] = useMemo(() => {
        return [
            <Title3 as="h3" block key={"h3"}>{locale.Login.loginTitle}</Title3>,
            {
                name: "account",
                fieldType: FormItemType.Input,
                customEle: (props) => <input {...props} />,
                rules: [
                    {
                        require: true,
                        message: locale.Login.accountValidate.invalidMsg,
                        validator: (account: string) => !!account
                    },
                    {
                        require: true,
                        message: locale.Login.accountValidate.lengthLimit,
                        validator: (account: string) => !!(account.length >= 3 && account.length <= 10)
                    }
                ],
                props: {
                    placeholder: locale.Login.accountPlaceholder,
                    className: classNames(classes.login_field_input, styles.body),
                }
            },
            {
                name: "password",
                fieldType: FormItemType.Input,
                customEle: (props) => <input {...props} />,
                rules: [
                    {
                        require: true,
                        message: locale.Login.passwordValidate.invalidMsg,
                        validator: (password: string) => !!password
                    },
                    {
                        require: true,
                        message: locale.Login.passwordValidate.lengthLimit,
                        validator: (password: string) => !!(password.length >= 6 && password.length <= 16)
                    }
                ],
                props: {
                    type: "password",
                    placeholder: locale.Login.passwordPlaceholder,
                    className: classNames(classes.login_field_input, styles.body),
                }
            },
            (
                <div key={"forgetPwd"}>
                    <Link target="_blank" href="https://github.com/vhvy/XiaoMu-PosSystem">{locale.Login.forgetPasswordText}</Link>
                </div>
            ),
            (
                <div className={classes.login_btn_group} key={"loginBtn"}>
                    <Button appearance="primary" shape="square" type="submit" icon={isLoading ? <Spinner size="tiny" appearance="inverted" /> : undefined} disabled={isLoading}>{locale.Login.loginConfirmBtn}</Button>
                </div>
            )
        ];
    }, [isLoading, locale]);

    const handleLoginSubmit = async (formData: LoginFormData) => {
        const { account, password } = formData;

        try {
            const res = await trigger({ account, password }) as LoginResponse;
            handleLoginSuccess(res);
        } catch (err) {
            const errMsg = getValidationErrors(err);
            Message.error(errMsg);
        }
    }

    if (isLogin || data && data.token) {
        const searchParams = getUrlParamsObj(location.search);

        const redirectPath = searchParams.from ?? "/";

        return <Navigate to={redirectPath} />;
    }

    return (
        <XMForm
            ref={ref}
            config={loginFormConfig}
            formClassName={classes.login_main_form}
            onSubmit={handleLoginSubmit}
        />
    );
}

export default forwardRef(LoginForm);