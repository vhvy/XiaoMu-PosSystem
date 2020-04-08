import React, { useMemo } from "react";
import { Form, message, Button, Radio } from "antd";
import { MoneyBoxConfig } from "../../../../device/money_box";

export const MoneyBox = Form.create()(_MoneyBox);

function _MoneyBox({
    form,
    closeFn
}) {


    const { getFieldDecorator, getFieldsValue } = form;

    const lastConfig = useMemo(() => {
        const config = MoneyBoxConfig.getConfig();
        return config && config || {};
    }, []);

    const config = [
        {
            id: "auto_open_box",
            label: "自动开钱箱",
            initialValue: lastConfig.auto_open_box !== undefined ? lastConfig.auto_open_box : true,
            component: (
                <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                </Radio.Group>
            )
        },
    ];

    const formLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 5
        }
    };

    function saveConfig() {
        const values = getFieldsValue();
        MoneyBoxConfig.setConfig(values);
        message.success("钱箱设置保存!");
        closeFn();
    }

    return (
        <Form {...formLayout}>
            {
                config.map(({ id, label, initialValue, component }) => (
                    <Form.Item key={id} label={label}>
                        {
                            getFieldDecorator(id, {
                                initialValue
                            })(component)
                        }
                    </Form.Item>
                ))
            }
            <Form.Item label=" " colon={false}>
                <Button onClick={saveConfig} type="primary">保存</Button>
            </Form.Item>
        </Form>
    );
}