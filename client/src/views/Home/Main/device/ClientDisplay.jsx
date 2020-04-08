import React from "react";
import { useSerialport } from "../../../../hooks/useSerialport";
import { Form, Select, Button, message } from "antd";
import { ClientDisplayConfig } from "../../../../device/client_display";

const { Option } = Select;

export const ClientDisplay = Form.create()(_ClientDisplay);

function _ClientDisplay({
    form,
    closeFn
}) {

    const serialPortList = useSerialport();
    // 串口列表

    const { getFieldDecorator, getFieldsValue } = form;

    const baudList = [
        "300", "1200", "2400", "9600", "19200", "38400", "115200"
    ];
    // 波特率列表

    const lastConfig = ClientDisplayConfig.getConfig();

    const config = [
        {
            id: "port",
            label: "串口",
            initialValue: lastConfig && lastConfig.port || null,
            component: (
                <Select>
                    {
                        serialPortList.map(({ port }) => <Option value={port} key={port} >{port}</Option>)
                    }
                </Select>
            )
        },
        {
            id: "baud",
            label: "波特率",
            initialValue: lastConfig && lastConfig.baud || null,
            component: (
                <Select>
                    {
                        baudList.map(baud => <Option value={baud} key={baud}>{baud}</Option>)
                    }
                </Select>
            )
        }
    ];

    const formLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 4
        }
    }

    const { port, baud } = getFieldsValue();

    function handleSave() {
        ClientDisplayConfig.setConfig({
            port,
            baud
        });

        message.success("客显调整完毕!");

        closeFn();
    }

    return (
        <Form {...formLayout} >
            {
                config.map(({ id, label, component, initialValue }) => (
                    <Form.Item key={id} label={label}>{
                        getFieldDecorator(id, {
                            initialValue
                        })(component)
                    }</Form.Item>
                ))
            }
            <Form.Item label=" " colon={false}>
                <Button disabled={!port || !baud} onClick={handleSave} type="primary">保存</Button>
            </Form.Item>
        </Form>
    );
}