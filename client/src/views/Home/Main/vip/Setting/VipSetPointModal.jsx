import React from "react";
import { Modal, Input, message, Form, Radio, InputNumber } from "antd";
import { VipManage } from "../../../../../tasks/vip";
import { useState } from "react";
import { useEffect } from "react";

const { Search } = Input;

export function VipSetPointModal({
    ajax,
    status,
    closeModal
}) {

    const [vipValue, setVipValue] = useState(null);

    const [code, setCode] = useState("");

    const initValue = {
        type: "add",
        point: 0
    };

    const [changeValue, setValue] = useState(initValue);

    const formLayout = {
        wrapperCol: {
            span: 17
        },
        labelCol: {
            span: 6
        }
    };

    async function getVipValue() {
        if (code.trim() === "" || code.length < 4) return;
        try {
            const { data } = await VipManage.frontQurey(ajax, code);
            if (data.length !== 1) {
                message.warn("没有找到此会员卡!");
            } else {
                setVipValue(data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleTypeChange({ target }) {
        setValue(s => ({
            ...s,
            type: target.value
        }));
    }

    function handlePointChange(v) {
        setValue(s => ({
            ...s,
            point: v
        }));
    }

    const SetComponent = (
        <>
            <Form.Item label="会员姓名">
                <Input value={vipValue && vipValue["name"] || ""} disabled />
            </Form.Item>
            <Form.Item label="当前积分">
                <Input value={vipValue && vipValue["vip_sum"] || 0} disabled />
            </Form.Item>
            <Form.Item label="调整类型">
                <Radio.Group
                    value={changeValue.type}
                    onChange={handleTypeChange}
                >
                    <Radio value="add">增加</Radio>
                    <Radio value="minus">减少</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="积分数值">
                <InputNumber
                    min={0}
                    max={10000}
                    value={changeValue.point}
                    onChange={handlePointChange}
                />
            </Form.Item>
        </>
    );

    function handleCodeChange({ target }) {
        setCode(target.value);
    }

    async function handleSetPoint() {
        try {
            await VipManage.setVipPoint(ajax, code, changeValue.point, changeValue.type);
            message.success("积分调整完成!");
            closeModal();

            setValue(initValue);
            setVipValue(null);
            setCode("");
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Modal
            visible={status}
            onCancel={closeModal}
            title="调整会员积分"
            okText="调整"
            destroyOnClose
            width={400}
            okButtonProps={{
                disabled: changeValue.point <= 0
            }}
            onOk={handleSetPoint}
        >
            <Form
                {...formLayout}
            >
                <Form.Item label="查询会员">
                    <Search
                        value={code}
                        placeholder="请输入会员卡号"
                        onChange={handleCodeChange}
                        onSearch={getVipValue}
                    />
                </Form.Item>
                {
                    vipValue && SetComponent
                }
            </Form>
        </Modal>
    );
}