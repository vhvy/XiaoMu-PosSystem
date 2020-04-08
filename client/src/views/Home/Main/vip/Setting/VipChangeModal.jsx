import React from "react";
import { Modal, Input, message, Form } from "antd";
import { VipManage } from "../../../../../tasks/vip";
import { useState } from "react";
import { useEffect } from "react";

function _VipChangeModal({
    status,
    closeModal,
    ajax,
    form
}) {

    const { getFieldDecorator, getFieldsError, getFieldsValue, isFieldsTouched, isFieldTouched } = form;

    const config = [
        {
            id: "old_code",
            label: "旧卡号",
            rules: [
                {
                    required: true,
                    message: "必须输入旧卡号!"
                },
                {
                    min: 4,
                    max: 10,
                    message: "请输入正确的卡号!"
                }
            ]
        },
        {
            id: "new_code",
            label: "新卡号",
            rules: [
                {
                    required: true,
                    message: "必须输入新卡号!"
                },
                {
                    min: 4,
                    max: 10,
                    message: "请输入正确的卡号!"
                }
            ]
        },
        {
            id: "description",
            label: "备注",
        }
    ];

    const cantEdit = (() => {
        if (!isFieldsTouched() || !isFieldTouched("old_code") || !isFieldTouched("new_code")) return false;

        const errors = getFieldsError();
        const keys = Object.keys(errors);

        for (let key of keys) {
            if (errors[key]) return false;
        }

        return true;
    })();

    const formLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 6
        }
    }

    async function handleChange() {

        const { old_code, new_code, description } = getFieldsValue();

        const value = { old_code, new_code };

        if (description && description.trim() !== "") {
            value.description = description;
        }

        try {
            await VipManage.vipChangeCard(ajax, value);

            message.success("会员卡修改成功!");

            closeModal();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            visible={status}
            onCancel={closeModal}
            title="会员补换卡"
            okText="修改"
            destroyOnClose
            width={350}
            onOk={handleChange}
            okButtonProps={{
                disabled: !cantEdit
            }}
        >
            <Form
                {...formLayout}
            >
                {
                    config.map(({ id, rules, label }) => (
                        <Form.Item key={id} label={label}>
                            {
                                getFieldDecorator(id, {
                                    rules
                                })(
                                    <Input />
                                )
                            }
                        </Form.Item>
                    ))
                }
            </Form>
        </Modal>
    );
}

export const VipChangeModal = Form.create()(_VipChangeModal);