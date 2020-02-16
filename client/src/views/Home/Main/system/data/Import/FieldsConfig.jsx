import React, { useMemo } from "react";
import styled from "../../../../../../styles/data/import.scss";
import { Select, Form, Radio, Col } from "antd";

const { Option } = Select;

function _FieldsConfig({
    data,
    option,
    typeConfig,
    form
}) {

    const { getFieldDecorator } = form;

    const { type, fields, rules } = typeConfig.find(i => i.type === option.import_type.value);

    const filter_field = useMemo(() => {
        // 可以选择的字段

        const keys = fields.map(({ field }) => field);
        // 所有需要选择字段的选项key

        const active_keys = keys.filter(key => option[key])
            .map(key => option[key].value);


        if (!data[0]) return [];

        return Object.keys(data[0]).filter(key => !active_keys.includes(key))
    }, [option, data]);


    const rulesLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 5
        }
    };

    function renderRules(rules) {
        return rules.map(({ id, label, defaultValue, option }) => (
            <Form.Item
                key={id}
                label={label}
                {...rulesLayout}
                labelAlign="left"
            >
                {
                    getFieldDecorator(id, {
                        initialValue: defaultValue
                    })(
                        <Radio.Group>
                            {
                                option.map(({ value, label }) => (
                                    <Radio
                                        value={value}
                                        key={label}
                                    >
                                        {label}
                                    </Radio>
                                ))
                            }
                        </Radio.Group>
                    )
                }
            </Form.Item>
        ));
    }

    function renderSelect(keys) {
        return (
            <Select
                allowClear
            >
                {
                    keys.map(key => <Option value={key} key={key}>{key}</Option>)
                }
            </Select>
        );
    }

    function renderFields(fields) {
        return fields.map(({ field, label, required = false }, index) => (
            <Col
                span={4}
                key={label}
                style={{
                    marginRight: 20
                }}
            >
                <Form.Item
                    label={label}
                    help=""
                >
                    {
                        getFieldDecorator(field, {
                            rules: [
                                {
                                    required,
                                    message: "此字段不能省略!"
                                }
                            ]
                        })(
                            renderSelect(filter_field)
                        )
                    }
                </Form.Item>
            </Col>
        ));
    }

    return (
        <div className={styled["fields-config-wrap"]}>
            <p>
                {
                    `上传的文件共有${data.length}条数据，拥有${data[0] && Object.keys(data[0]).length || 0}个字段`
                }
            </p>

            <Form>
                <Form.Item
                    {...rulesLayout}
                    labelAlign="left"
                    label="导入数据类型"
                >
                    {
                        getFieldDecorator("import_type", {
                            initialValue: type
                        })(
                            <Select>
                                {
                                    typeConfig.map(({ type }) => <Option value={type} key={type}>{type}</Option>)
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                {
                    rules && renderRules(rules)
                }
                {
                    data[0] && fields && renderFields(fields)
                }
            </Form>
        </div>
    );
}

function onFieldsChange(props, changedFields, allFields) {
    const { setOption } = props;
    setOption(s => ({
        ...s,
        ...changedFields
    }));
}

function mapPropsToFields({ option }) {
    const keys = Object.keys(option);
    let fields = {};
    for (let key of keys) {
        fields[key] = Form.createFormField(option[key]);
    }

    return fields;
}

export const FieldsConfig = Form.create({
    onFieldsChange,
    mapPropsToFields
})(_FieldsConfig);