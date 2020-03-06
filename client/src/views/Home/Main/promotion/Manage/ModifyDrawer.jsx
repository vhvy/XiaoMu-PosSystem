import React, { useMemo } from "react";
import moment from "moment";
import { Drawer, Form, Input, DatePicker, Button, message } from "antd";
import { PromotionManage } from "../../../../../tasks/promotion";

const { RangePicker } = DatePicker;

function _ModifyDrawer({
    status,
    type,
    closeFn,
    form,
    currentPromo,
    ajax,
    setPromoList
}) {

    const { getFieldDecorator, getFieldsValue, getFieldsError, isFieldsTouched, isFieldTouched } = form;

    const config = [
        {
            type: "add",
            title: "新建促销活动",
            okText: "新建",
            handleFn: createPromotion
        },
        {
            type: "edit",
            title: "修改促销活动",
            okText: "修改",
            handleFn: editPromotion
        }
    ];

    const { title, okText, handleFn } = config.find(i => i.type === type);

    const isAddMode = type === "add";

    const initValue = useMemo(() => {
        if (isAddMode || !currentPromo) {
            return {
                name: undefined,
                date_range: undefined,
                description: undefined
            };
        } else {
            return {
                name: currentPromo.name,
                date_range: [
                    moment(currentPromo.start_date),
                    moment(currentPromo.end_date)
                ],
                description: currentPromo.description
            };
        }
    }, [type, currentPromo]);

    const children = [
        {
            id: "name",
            label: "活动名称",
            rules: [
                {
                    required: true,
                    message: "活动名称不能省略!"
                },
                {
                    min: 1,
                    max: 20,
                    message: "活动名称字数应保持在1-20之间!"
                }
            ]
        },
        {
            id: "date_range",
            label: "活动时间",
            component: (
                <RangePicker
                    showTime={{
                        defaultValue: [moment("00:00:00", "HH:mm:ss"), moment("23:59:59", "HH:mm:ss")]
                    }}
                />
            ),
            rules: [
                {
                    required: true,
                    message: "活动时间不能省略!"
                }
            ]
        },
        {
            id: "description",
            label: "备注",
            rules: [
                {
                    min: 1,
                    max: 30,
                    message: "备注字数应保证在1-30之间!"
                }
            ]
        }
    ];

    function renderItem(list) {
        return list.map(({ id, label, component, rules }) => (
            <Form.Item
                key={id}
                label={label}
            >
                {
                    getFieldDecorator(id, {
                        rules,
                        initialValue: initValue[id]
                    })(
                        component || <Input />
                    )
                }
            </Form.Item>
        ));
    }


    const formLayout = {
        wrapperCol: {
            span: 18
        },
        labelCol: {
            span: 4
        }
    };

    const required_id = useMemo(() => children.reduce((list, { id, rules }) => {
        const isRequired = rules.find(({ required = false }) => required);
        isRequired && list.push(id);
        return list;
    }, []), []);

    const hasError = (() => {

        if (!isFieldsTouched()) return true;
        // 如果任何一个组件没有没输入过直接返回有错误

        if (type === "add") {

            for (let id of required_id) {
                if (!isFieldTouched(id)) return true;
                // 如果任何一个必选组件没有输入过直接返回有错误
            }
        }

        const errors = getFieldsError();
        const keys = Object.keys(errors);
        for (let key of keys) {
            if (errors[key]) return true;
        }


        return false;
    })();

    function getValues() {
        const { name, date_range, description } = getFieldsValue();
        const [start_date, end_date] = date_range.map(time => Number(time.format("x")));
        let values = {
            name,
            start_date,
            end_date
        };

        description && (values.description = description);

        return values;
    }

    async function createPromotion() {
        // 创建促销活动

        const value = getValues();

        try {
            const { data } = await PromotionManage.createPromotion(ajax, value);
            setPromoList(s => [...s, data]);
            message.success(`${name}创建完成!`);
            closeFn();
        } catch (error) {
            console.log(error);
        }
    }

    async function editPromotion() {
        // 修改促销活动

        const value = getValues();

        let need_update_value = {};

        const keys = Object.keys(value);

        let updateFlag = false;
        // 是否需要更新的flag

        for (let key of keys) {
            if (value[key] && currentPromo[key] !== value[key]) {
                // 当表单值和活动值不相符时更新此值

                need_update_value[key] = value[key];
                !updateFlag && (updateFlag = true);
            }
        }

        if (!updateFlag) return message.info("没有值发生变化，不需要更新!");

        try {

            const { name, id } = currentPromo;

            let update_value = {};

            if (need_update_value.name) {
                const { name, ...args } = need_update_value;
                update_value = {
                    ...args,
                    new_name: name
                };
            } else {
                update_value = { ...need_update_value };
            }

            await PromotionManage.editPromotion(ajax, {
                name,
                update_value
            });

            setPromoList(s => s.map(i => {
                if (i.id === id) {
                    return {
                        ...currentPromo,
                        ...need_update_value
                    };
                }

                return i;
            }));

            message.success("活动修改完成！");
            closeFn();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Drawer
            visible={status}
            onClose={closeFn}
            title={title}
            width={515}
        >
            <Form
                {...formLayout}
            >
                {
                    renderItem(children)
                }
                <Form.Item
                    label=" "
                    colon={false}
                >
                    <Button
                        type="primary"
                        disabled={hasError}
                        onClick={handleFn}
                    >
                        {okText}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}


export const ModifyDrawer = Form.create()(_ModifyDrawer);