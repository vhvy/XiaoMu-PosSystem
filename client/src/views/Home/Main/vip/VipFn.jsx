import React, { useState } from "react";
import styled from "../../../../styles/vip.scss";
import { Button, Input } from "antd";

const { Search } = Input;

export function VipFn({ list, handleSelect, handleDel, handleDisable, selectItem, handleEnable, showDrawer, handleEditVip }) {

    const cantEdit = Boolean(selectItem);

    const enable = selectItem && selectItem.is_disable;

    const config = [
        {
            label: "新增",
            fn: showDrawer
        },
        {
            label: "编辑",
            disabled: !cantEdit,
            fn: handleEditVip
        },
        {
            label: enable ? "启用" : "禁用",
            btnType: "danger",
            disabled: !cantEdit,
            fn: enable ? handleEnable : handleDisable
        },
        {
            label: "删除",
            btnType: "danger",
            disabled: !cantEdit,
            fn: handleDel
        }
    ];

    function handleSearch(query) {
        const item = list.find(({ code, name, phone }) => code.includes(query) || name.includes(query) || phone && phone.includes(query));
        if (item) {
            handleSelect(item.id, "origin");
        }
    }

    return (
        <div className={styled["vip-fn"]}>
            <Search
                placeholder="请输入要查询的会员信息"
                onSearch={handleSearch}
            />
            {
                config.map(({ label, disabled = false, btnType = "primary", fn }) => (
                    <Button
                        key={label}
                        disabled={disabled}
                        type={btnType}
                        onClick={fn}
                    >
                        {label}
                    </Button>
                ))
            }
        </div>
    );
}