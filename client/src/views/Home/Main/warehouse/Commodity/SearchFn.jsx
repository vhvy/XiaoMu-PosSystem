import React from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setWareSelectCommodityAction } from "../../../../../redux/action";

const { Search } = Input;

export function SearchFn({ value }) {

    const {
        handleUpSelect,
        handleDownSelect,
        can_edit
    } = value;

    function handleAdd() {
        console.log("add");
    }

    function handleEdit() {
        console.log("Edit");
    }

    function handleDel() {
        console.log("del");
    }

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

    return (
        <div className={styled["search"]}>
            <Search placeholder="请在此输入要查询的商品" onKeyDown={handleHotKey} />
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