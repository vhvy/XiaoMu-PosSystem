import React from "react";
import styled from "../../../../../styles/promotion/commodity.scss";
import { Select, Button, Icon } from "antd";

const { Option } = Select;

export function CommodityFn({
    promoList,
    currentPromo,
    setCurrentPromo,
    cantEditCommod = false,
    handleDelCommod,
    handleAdd,
    handleEdit
}) {

    const config = [
        {
            label: "新增商品",
            icon: "plus",
            disabled: !currentPromo,
            fn: handleAdd
        },
        {
            label: "修改商品",
            icon: "edit",
            disabled: !cantEditCommod,
            fn: handleEdit
        },
        {
            label: "删除商品",
            icon: "delete",
            type: "danger",
            disabled: !cantEditCommod,
            fn: handleDelCommod
        }
    ];

    return (
        <div className={styled["commodity-fn-wrap"]}>
            <Select
                value={currentPromo}
                className={styled["select-wrap"]}
                onChange={setCurrentPromo}
                placeholder="请选择促销活动"
            >
                {
                    promoList.map(name => (
                        <Option
                            value={name}
                            key={name}
                            title={name}
                        >
                            {name}
                        </Option>
                    ))
                }
            </Select>
            {
                config.map(({ label, type = "primary", fn, icon, disabled }) => (
                    <Button
                        key={label}
                        type={type}
                        onClick={fn}
                        disabled={disabled}
                    >
                        <Icon type={icon} />
                        {label}
                    </Button>
                ))
            }
        </div>
    );
}