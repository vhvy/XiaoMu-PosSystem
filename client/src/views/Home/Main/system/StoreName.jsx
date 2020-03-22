import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { StoreTasks } from "../../../../tasks/store";
import { useAuth } from "../../../AuthProvider";

export function StoreName({
    closeFn,
    ajax
}) {

    const { setStoreName } = useAuth();

    const [nameData, setNameData] = useState({});
    // 店铺名称数据

    const [loading, setLoading] = useState(false);
    // 修改按钮loading状态

    async function getName() {
        try {
            const { data } = await StoreTasks.getStoreName(ajax);

            setNameData(s => ({
                ...s,
                old_name: data
            }));

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getName();
    }, []);

    function handleChange({ target }) {
        const { value } = target;
        setNameData(s => ({
            ...s,
            new_name: value
        }));
    }

    const config = [
        {
            id: "old_name",
            label: "当前店名",
            component: (
                <Input
                    disabled
                    value={nameData.old_name}
                />
            )
        },
        {
            id: "new_name",
            label: "新店名",
            component: (
                <Input
                    placeholder="请在此输入新的店名"
                    value={nameData.new_name}
                    onChange={handleChange}
                />
            )
        }
    ];

    async function handleChangeName() {
        setLoading(true);

        const { new_name } = nameData;

        try {
            const { data } = await StoreTasks.setStoreName(ajax, new_name);

            setStoreName(new_name);
            // 更新redux中的商店名称

            message.success(data.message);

            setLoading(false);

            closeFn();
        } catch (error) {
            console.log(error);
        }
    }

    const formLayout = {
        wrapperCol: {
            span: 18
        },
        labelCol: {
            span: 5
        }
    };

    const isDisabled = !(nameData.new_name && nameData.new_name.trim() !== "" && nameData.new_name.length < 10);

    return (
        <Form
            {...formLayout}
        >
            {
                config.map(({ id, label, component }) => (
                    <Form.Item label={label} key={id}>
                        {component}
                    </Form.Item>
                ))
            }
            <Form.Item label=" " colon={false}>
                <Button
                    type="primary"
                    disabled={isDisabled}
                    onClick={handleChangeName}
                    loading={loading}
                >修改</Button>
            </Form.Item>
        </Form>
    );
}