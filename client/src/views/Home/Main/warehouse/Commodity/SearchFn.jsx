import React, { useRef, useEffect } from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { Input, Button } from "antd";

const { Search } = Input;

export function SearchFn({
    value,
    handleAdd,
    handleEdit,
    handleDel,
    handleSearch
}) {

    const {
        handleUpSelect,
        handleDownSelect,
        can_edit
    } = value;

    const btnList = [
        {
            title: "增加商品",
            hotkey: "F1",
            type: "primary",
            fn: handleAdd
        },
        {
            title: "修改商品",
            hotkey: "F2",
            type: "primary",
            fn: handleEdit,
            disabled: !can_edit
        },
        {
            title: "删除商品",
            hotkey: "F3",
            type: "danger",
            fn: handleDel,
            disabled: !can_edit
        },
        {
            hotkey: "ArrowUp",
            fn: handleUpSelect,
            show: false
        },
        {
            hotkey: "ArrowDown",
            fn: handleDownSelect,
            show: false
        }
    ];

    function handleHotKey(e) {
        const { key } = e;
        const item = btnList.find(i => i.hotkey === key);

        item && (() => {
            e.preventDefault();
            item.fn();
        })();
    }

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <div className={styled["search"]}>
            <Search
                placeholder="请在此输入要查询的商品"
                onKeyDown={handleHotKey}
                onSearch={handleSearch}
                ref={inputRef}
            />
            {
                btnList.filter(({ show = true }) => show).map(({ title, hotkey, fn, type, disabled = false }) => (
                    <Button
                        key={hotkey}
                        type={type}
                        onClick={fn}
                        disabled={disabled}
                    >
                        {`${title} <${hotkey}>`}
                    </Button>
                ))
            }
        </div>
    );
}