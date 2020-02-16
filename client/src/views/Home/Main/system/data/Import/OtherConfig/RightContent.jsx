import React, { useState } from "react";
import styled from "../../../../../../../styles/data/import.scss";
import { Select, Form, Radio, Input, InputNumber, Button, Icon, Modal } from "antd";

const { Option } = Select;

export function RightContent({
    handleCurrentField,
    handleCurrentValue,
    handleAddMapValue,
    currentField,
    show_mapFields,
    setMapValueList
}) {

    function cleanMapValue() {
        Modal.confirm({
            title: "确认要清空所有映射值吗?",
            okButtonProps: {
                type: "danger"
            },
            okText: "清空",
            onOk: (cb) => {
                setMapValueList(s => s.length === 0 ? s : []);
                cb();
            }
        });
    }

    const [convertType, setConvertType] = useState("text");
    // 将属性值转换后的类型

    const [value, setValue] = useState({
        "text": "",
        "num": 0,
        "bool": false
    });

    function addMapValue() {
        handleAddMapValue(value[convertType]);
    }

    const inputComponent = {
        "text": {
            component: (
                <Input
                    value={value.text}
                    onChange={({ target }) => setValue(s => ({
                        ...s,
                        text: target.value
                    }))}
                />
            ),
            disabled: value["text"].trim() === ""
        },
        "bool": {
            component: (
                <Radio.Group
                    value={value.bool}
                    onChange={({ target }) => setValue(s => ({
                        ...s,
                        bool: target.value
                    }))}
                >
                    <Radio value={true}>true</Radio>
                    <Radio value={false}>false</Radio>
                </Radio.Group>
            ),
            disabled: false
        },
        "num": {
            component: (
                <InputNumber
                    value={value.num}
                    onChange={num => setValue(s => ({
                        ...s,
                        num
                    }))}
                />
            ),
            disabled: false
        }
    };

    const config = [
        {
            label: "撤消",
            component: (
                <Button
                    type="danger"
                    onClick={cleanMapValue}
                >
                    <Icon type="undo" />
                    撤销所有映射
                </Button>
            )
        },
        {
            label: "属性名",
            component: (
                <Select
                    onChange={handleCurrentField}
                    value={currentField.field}
                >
                    {
                        show_mapFields.map(({ field, label }) => (
                            <Option
                                value={field}
                                key={field}
                            >
                                {label}
                            </Option>
                        ))
                    }
                </Select>
            )
        },
        {
            label: "属性值",
            component: (
                <Select
                    onChange={handleCurrentValue}
                    value={currentField.value}
                >
                    {
                        currentField.value_list.map((v, index) => (
                            <Option
                                value={v}
                                key={index}
                            >
                                {v}
                            </Option>
                        ))
                    }
                </Select>
            )
        },
        {
            label: "转换类型",
            component: (
                <Radio.Group
                    value={convertType}
                    onChange={({ target }) => setConvertType(target.value)}
                >
                    <Radio value="text">文本值</Radio>
                    <Radio value="bool">布尔值</Radio>
                    <Radio value="num">数值</Radio>
                </Radio.Group>
            )
        },
        {
            label: "转换值",
            component: inputComponent[convertType].component
        },
        {
            label: " ",
            component: (
                <Button
                    type="primary"
                    disabled={inputComponent[convertType].disabled}
                    onClick={addMapValue}
                >
                    <Icon type="plus" />
                    添加
                </Button>
            ),
            colon: false,
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

    return (
        <Form
            {...formLayout}
            className={styled["right-wrap"]}
        >
            {
                config.map(({ label, component, ...args }) => (
                    <Form.Item
                        label={label}
                        key={label}
                        {...args}
                    >
                        {
                            component && component
                        }
                    </Form.Item>
                ))
            }
        </Form>
    );

}