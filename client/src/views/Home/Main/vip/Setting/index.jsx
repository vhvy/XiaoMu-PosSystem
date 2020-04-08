import React, { useState } from "react";
import { Card } from "antd";
import { useAjax } from "../../../../AjaxProvider";
import styled from "../../../../../styles/vip.scss";
import { VipRuleModal } from "./VipRuleModal";
import { VipChangeModal } from "./VipChangeModal";
import { VipSetPointModal } from "./VipSetPointModal";

export function VipSetting() {

    const ajax = useAjax();

    const [ruleStatus, setRuleStatus] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [pointStatus, setPointStatus] = useState(false);

    function showPointModal() {
        setPointStatus(true);
    }

    function closePointModal() {
        setPointStatus(false);
    }

    function closeChangeModal() {
        setChangeStatus(false);
    }

    function showChangeModal() {
        setChangeStatus(true);
    }

    function closeRuleModal() {
        setRuleStatus(false);
    }

    function showRuleModal() {
        setRuleStatus(true);
    }

    const config = [
        {
            title: "会员卡规则设置",
            action: [
                {
                    title: "积分卡积分比例",
                    fn: showRuleModal
                }
            ]
        },
        {
            title: "会员卡其他操作",
            action: [
                {
                    title: "会员补换卡",
                    fn: showChangeModal
                },
                {
                    title: "会员卡积分调整",
                    fn: showPointModal
                }
            ]
        }
    ];

    function renderItem({ title, fn }) {

        return (
            <Card.Grid
                className={styled["vip-setting-grid"]}
                key={title}
                onClick={fn}
            >
                {title}
            </Card.Grid>
        );
    }

    function renderBox({ title, action }) {
        return (
            <Card key={title} title={title}>
                {
                    action.map(i => renderItem(i))
                }
            </Card>
        );
    }

    return (
        <div className={styled["vip-setting-wrap"]}>
            {
                config.map(i => renderBox(i))
            }
            <VipRuleModal
                status={ruleStatus}
                ajax={ajax}
                closeModal={closeRuleModal}
            />
            <VipChangeModal
                status={changeStatus}
                ajax={ajax}
                closeModal={closeChangeModal}
            />
            <VipSetPointModal
                status={pointStatus}
                ajax={ajax}
                closeModal={closePointModal}
            />
        </div>
    );
}