import { FC, FormEvent, ForwardedRef, HTMLInputTypeAttribute, forwardRef, isValidElement, useState, useRef, useEffect } from "react";
import { Button, FieldProps, Field, Input, makeStyles, typographyStyles, Link, Subtitle2, Title3, Body1, Caption1, ButtonProps, InputProps } from "@fluentui/react-components";
import useDidMountEffect from "@/hooks/useDidMountedEffect";

type Validator = (value: any) => boolean;

interface Rule {
    message: string,
    validator: Validator,
    require?: boolean
};

export const enum FormItemType {
    Input,
    Textarea,
    Button
};

type CustomEleFC = (props: any) => React.ReactElement<any>;

interface FormItemInputConfig {
    name: string,
    customEle?: CustomEleFC,
    label?: string,
    fieldType: FormItemType.Input,
    rules?: Rule[],
    validationMessage?: string,
    defaultValue?: string,
    value?: string,
    props?: InputProps
}

interface FormItemButtonConfig {
    name: string,
    fieldType: FormItemType.Button,
    btnText: string,
    props?: ButtonProps
}

export type FormConfig = FormItemInputConfig | FormItemButtonConfig | React.ReactElement;

export type HandleSubmitFn = ((formData: any) => Promise<void>) | ((formData: any) => void);

export interface XMFormProps {
    config: FormConfig[],
    formClassName?: string,
    onSubmit?: HandleSubmitFn
};

type Ref = HTMLFormElement;

type InputEvent = FormEvent<HTMLInputElement>;

const mergeFormConfig = (oldConfig: FormConfig[], newConfig: FormConfig[]): FormConfig[] => {
    let oldConfigMap: {
        [index: string]: FormItemInputConfig | FormItemButtonConfig
    } = {};

    for (const config of oldConfig) {
        if (isValidElement(config) || !("fieldType" in config)) continue;
        oldConfigMap[config.name] = config;
    }

    return newConfig.map(config => {
        if (isValidElement(config) || !("fieldType" in config)) return config;

        if (config.fieldType === FormItemType.Input) {
            const oldConfigItem = oldConfigMap[config.name];
            if (oldConfigItem) {
                const { validationMessage, value } = oldConfigItem as FormItemInputConfig;
                return {
                    ...config,
                    value,
                    validationMessage
                };
            }
        }

        return config;
    });
}

const createInitConfig = (list: FormConfig[]): FormConfig[] => {
    return list.map(config => {
        if (isValidElement(config) || !("fieldType" in config)) return config;

        if (config.fieldType === FormItemType.Input) {
            if (config.defaultValue) {
                return {
                    ...config,
                    value: config.defaultValue
                };
            }
        }

        return config;
    });
}

const enum UpdateStatus {
    OK,
    ERROR,
    OK_BUT_LAST_ERROR
}

const XMForm = ({ config, formClassName, onSubmit }: XMFormProps, ref: ForwardedRef<Ref>) => {

    const [formConfig, setFormConfig] = useState(() => createInitConfig(config));

    useDidMountEffect(() => {
        setFormConfig(mergeFormConfig(formConfig, config));
    }, [config]);
    
    function handleChange(e: InputEvent, config: FormItemInputConfig, index: number): void;
    function handleChange(e: InputEvent, config: FormItemInputConfig, index: number) {
        if (!config?.rules?.length) return;
        if (config.fieldType === FormItemType.Input) {
            const val = e.currentTarget.value;
            for (let rule of config.rules) {
                let status = UpdateStatus.OK;

                if (!val && !rule.require) continue;
                // 不需要进行校验且没有值时跳过

                if (val || rule.require) {
                    const hasError = !rule.validator(val);

                    if (hasError) status = UpdateStatus.ERROR;
                    else if (config.validationMessage) status = UpdateStatus.OK_BUT_LAST_ERROR;
                }

                setFormConfig(formConfig => {
                    return formConfig.map((item, idx) => {
                        if (idx === index) {
                            return {
                                ...item,
                                value: val,
                                validationMessage: status === UpdateStatus.ERROR ? rule.message : ""
                            };
                        }

                        return item;
                    });
                });
            }
        }
    }

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!onSubmit) return;

        const form = e.currentTarget;

        for (let config of formConfig) {
            if (isValidElement(config) || !("fieldType" in config)) continue;

            if (config.fieldType === FormItemType.Input) {
                if (config.validationMessage) return;
                if (config?.rules?.length) {
                    const val = form[config.name]?.value;

                    for (let rule of config.rules) {
                        if (!val && !rule.require) continue;
                        if (!rule.validator(val)) return;
                    }
                }
            }
        }

        const formData = Object.fromEntries(new FormData(form));
        onSubmit(formData);
    }

    return (
        <form ref={ref} className={formClassName} onSubmit={handleSubmit}>
            {
                formConfig.map((item, index) => {
                    if (isValidElement(item) || !("fieldType" in item)) {
                        return item;
                    } else {
                        if (item.fieldType === FormItemType.Input) {
                            const { customEle: Comp, name, props, validationMessage, label, value = "" } = item;
                            return (
                                <Field key={name} validationMessage={validationMessage} validationState={validationMessage ? "error" : "none"} label={label}>
                                    {fieldProps => Comp ?
                                        <Comp
                                            {...fieldProps}
                                            {...{
                                                value,
                                                ...props
                                            }}
                                            key={name}
                                            name={name}
                                            onChange={(e: InputEvent) => handleChange(e, item, index)}
                                        />
                                        :
                                        <Input
                                            {...fieldProps}
                                            {...props}
                                            value={value}
                                            key={name}
                                            name={name}
                                            onChange={e => handleChange(e, item, index)}
                                        />
                                    }
                                </Field>
                            );
                        } else if (item.fieldType === FormItemType.Button) {
                            const { btnText, props } = item;
                            return (
                                <Button {...props}>{btnText}</Button>
                            );
                        }

                        return null;
                    }
                })
            }
        </form>
    );
};

export default forwardRef<Ref, XMFormProps>(XMForm);