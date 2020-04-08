import React from "react";
import { Modal, InputNumber, message } from "antd";
import { VipManage } from "../../../../../tasks/vip";
import { useState } from "react";
import { useEffect } from "react";

let baseRule = 0;

export function VipRuleModal({
    status,
    ajax,
    closeModal
}) {

    const [point, setPoint] = useState(0);

    async function getRule() {
        try {
            const { data } = await VipManage.getVipPointRules(ajax);
            const { result } = data;
            baseRule = result;
            setPoint(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRule();
    }, []);

    async function handleSetRule() {
        try {
            await VipManage.updateVipPointRules(ajax, point);
            message.success("积分比例修改完成!");
            closeModal();
        } catch (error) {
            console.log(error);
        }
    }

    function handleChange(e) {
        setPoint(e);
    }

    const cantSubmit = point !== baseRule && !Number.isNaN(point) && point > 0 && point <= 100;

    return (
        <Modal
            visible={status}
            onCancel={closeModal}
            title="修改会员卡积分比例"
            onOk={handleSetRule}
            okButtonProps={{
                disabled: !cantSubmit
            }}
        >
            每1元消费累积&nbsp;&nbsp;
            <InputNumber
                min={1}
                max={100}
                value={point}
                onChange={handleChange}
            />&nbsp;&nbsp;积分
        </Modal>
    )
}