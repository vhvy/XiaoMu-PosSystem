import React from "react";
import { Form, Radio } from "antd";

function BaseRadioGroup({
    list,
    value,
    onChange
}) {

    return (
        <Radio.Group value={value} onChange={onChange}>
            {
                list.map(i => (<Radio value={i} key={i}>{i}</Radio>))
            }
        </Radio.Group>
    );
}

export function TypeConfig({
    dataTypeList,
    fileTypeList,
    setType,
    dataType,
    fileType
}) {


    const config = [
        {
            id: "dataType",
            label: "导出类型",
            list: dataTypeList,
            value: dataType
        },
        {
            id: "fileType",
            label: "文件格式",
            list: fileTypeList,
            value: fileType
        }
    ];

    const onChange = id => ({ target }) => setType(s => ({ ...s, [id]: target.value }));

    return (
        <Form>
            {
                config.map(({ id, label, list, value }) => (
                    <Form.Item label={label} key={id}>
                        <BaseRadioGroup list={list} value={value} onChange={onChange(id)} />
                    </Form.Item>
                ))
            }
        </Form>
    );
}