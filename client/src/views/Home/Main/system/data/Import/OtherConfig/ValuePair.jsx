import React from "react";
import styled from "../../../../../../../styles/data/import.scss";
import { Icon, Tag } from "antd";

export function ValuePair({
    field,
    label,
    values,
    handleDelete
}) {



    function renderItem(value, new_value, index) {
        return (
            <div
                className={styled["value-item"]}
                key={value + "" + index}
            >
                <div className={styled["value-pair"]}>
                    <Tag
                        title={value + ""}
                        color="#f50"
                    >
                        {value + ""}
                    </Tag>
                    <span className={styled["value-item-arrow"]}>-></span>
                    <Tag
                        color="#2db7f5"
                        title={new_value + ""}
                    >
                        {new_value + ""}
                    </Tag>
                </div>
                <Icon
                    type="delete"
                    title="删除此项映射"
                    className={styled["del-btn"]}
                    onClick={handleDelete.bind(null, field, value)}
                />
            </div>
        )
    }

    return (
        <div className={styled["value-pair-wrap"]}>
            <div className={styled["field-name"]}>
                <Tag
                    title={label}
                >
                    {label}
                </Tag>
            </div>
            <div className={styled["value-list"]}>
                {
                    values.map(({ value, new_value }, index) => renderItem(value, new_value, index))
                }
            </div>
        </div>
    );
}
