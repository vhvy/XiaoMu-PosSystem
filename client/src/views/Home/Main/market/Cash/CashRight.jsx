import React from "react";
import { Col, Badge } from "antd";
import styled from "../../../../../styles/cash.scss";

function CashHotKeyBtn({ label, hotkey, fn = () => { }, count = 0 }) {

    const Component = (
        <div className={styled["cash-hotkey"]} onClick={fn} >
            <span>{label}</span>
            <span>&lt;{hotkey}&gt;</span>
        </div>
    );

    if (label === "挂单/取单") {
        return (
            <Badge
                offset={[-3, 3]}
                count={count}
            >
                {Component}
            </Badge>
        );
    }

    return Component;
}

export function CashRight({ show = false, hotkey, count }) {
    if (!show) return null;


    return (
        <Col style={{
            width: 100,
            height: "100%",
            marginLeft: 10
        }}>
            <div className={styled["cash-right"]}>
                {
                    hotkey
                        .filter(({ show = true }) => show)
                        .map(
                            ({ key, label, fn, ...args }) =>
                                <CashHotKeyBtn
                                    key={key}
                                    hotkey={key}
                                    label={label}
                                    fn={fn}
                                    count={count}
                                    {...args}
                                />
                        )
                }
            </div>
        </Col>
    );
}