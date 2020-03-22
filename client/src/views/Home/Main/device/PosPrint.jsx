import React from "react";
import { Form, Select, Button, message } from "antd";
import { usePosprint } from "../../../../hooks/usePosprint";
import { PosPrintConfig } from "../../../../device/pos_print";

const { Option } = Select;

export const PosPrint = Form.create()(_PosPrint);

function _PosPrint({
    form,
    closeFn
}) {

    const posPrintList = usePosprint();

    const { getFieldDecorator, getFieldValue } = form;

    const config = [
        {
            id: "pos",
            label: "小票打印机",
            initialValue: PosPrintConfig.getPosPrintName(),
            component: (
                <Select>
                    {
                        posPrintList.map(({ name }) => (
                            <Option value={name} key={name}>{name}</Option>
                        ))
                    }
                </Select>
            )
        }
    ];

    const formLayout = {
        wrapperCol: {
            span: 18
        },
        labelCol: {
            span: 5
        }
    };

    const posName = getFieldValue("pos");

    function handleSave() {
        // 保存小票机打印配置

        PosPrintConfig.setPosPrintName(posName);
        message.success("小票打印机配置成功!");
        closeFn();
    }

    return (
        <Form
            {...formLayout}
        >
            {
                config.map(({ id, label, component, initialValue }) => (
                    <Form.Item key={id} label={label}>
                        {
                            getFieldDecorator(id, { initialValue })(component)
                        }
                    </Form.Item>
                ))
            }
            <Form.Item label=" " colon={false}>
                <Button disabled={!posName} type="primary" onClick={handleSave}>保存</Button>
            </Form.Item>
        </Form>
    );
}