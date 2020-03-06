import React from "react";
import styled from "../../../../../styles/promotion/manage.scss";
import { Button, Input, Icon } from "antd";

const { Search } = Input;

export function ManageFn({
    handleAdd,
    handleEdit,
    handleDel,
    handleSearch,
    canChange
}) {

    const config = [
        {
            label: "新增",
            icon: "plus",
            fn: handleAdd
        },
        {
            label: "修改",
            icon: "edit",
            fn: handleEdit,
            disabled: !canChange
        },
        {
            label: "删除",
            type: "danger",
            icon: "delete",
            fn: handleDel,
            disabled: !canChange
        }
    ];

    function handleQuery(_query) {
        const query = _query.trim();
        query !== "" && handleSearch(query);
    }

    return (
        <div className={styled["manage-fn"]}>
            <Search
                placeholder="请在此输入活动名称"
                style={{
                    width: 200,
                    marginRight: 10
                }}
                onSearch={handleQuery}
            />
            {
                config.map(({
                    label,
                    icon,
                    type = "primary",
                    fn,
                    disabled = false
                }) => (
                        <Button
                            key={label}
                            type={type}
                            onClick={fn}
                            disabled={disabled}
                        >
                            {icon && <Icon type={icon} />}
                            {label}
                        </Button>
                    ))
            }
        </div>
    );
}