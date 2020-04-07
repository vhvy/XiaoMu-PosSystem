import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, message } from "antd";
import { VirtualSelectList } from "../../../../../../components/VirtualSelectList";
import { useAjax } from "../../../../../AjaxProvider";
import styled from "../../../../../../styles/cash.scss";
import { VipManage } from "../../../../../../tasks/vip";
import { useMemo } from "react";

const { Search } = Input;

const columns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "类型",
        key: "type",
        type: 1
    },
    {
        title: "姓名",
        key: "name",
        type: 1
    },
    {
        title: "卡号",
        key: "code",
        type: 1
    },
    {
        title: "手机号",
        key: "phone",
        type: 2
    },
    {
        title: "积分",
        key: "vip_sum",
        type: 3
    },
    {
        title: "消费次数",
        key: "consume_count",
        type: 3
    }
];

function List({ list, select, selectType, handleClick }) {

    return (
        <VirtualSelectList
            wrapStyle={{
                marginTop: 20,
                height: 250
            }}
            columns={columns}
            data={list}
            select={select}
            selectType={selectType}
            handleClickSelect={handleClick}
        />
    );
}

const initState = {
    list: [],
    select: 0,
    selectType: "origin"
};

export function SetVipModal({ status, hideFn, setVip, clearVip }) {

    const [value, setValue] = useState("");
    const [data, setData] = useState(initState);
    const [btnLoading, setBtnLoading] = useState(false);


    const inputRef = useRef(null);
    const ajax = useAjax();

    function handleInput({ target }) {
        setValue(target.value);
    }

    function handleClickSelect(id) {
        setData(s => ({
            ...s,
            select: id
        }));
    }

    async function handleSearch() {
        if (value.trim().length === 0) return;
        setBtnLoading(true);
        try {
            const { data } = await VipManage.frontQurey(ajax, value.trim().toUpperCase());
            if (data.length === 0) {
                message.warn("没有找到相关的会员卡!")
            } else if (data.length === 1) {
                const vipValue = data[0];
                if (vipValue.is_disable) {
                    message.warn("此会员卡已被禁用！");
                } else {
                    closeModal();
                    setVip(vipValue);
                }
            } else {
                setData(s => ({
                    ...s,
                    list: data,
                    select: data[0].id
                }));
            }
        } catch (err) {
            console.log(err);
        }
        setBtnLoading(false);
    }

    function closeModal() {
        hideFn();
        setValue("");
        setData(initState);
    }

    function handleKey(e) {
        const { key, ctrlKey } = e;
        const { list, select } = data;
        if (key === "F9") {
            e.preventDefault();
            closeModal();
            clearVip();
        } else if (list.length > 0 && ctrlKey && key === "Enter") {
            e.preventDefault();

            const vipValue = list.find(({ id }) => id === select);
            if (vipValue.is_disable) {
                message.warn("此会员卡已被禁用！");
            } else {
                closeModal();
                setVip(vipValue);
            }
        } else if (list.length > 1) {
            const index = list.findIndex(({ id }) => id === select);
            if (key === "ArrowUp" && index !== 0) {
                e.preventDefault();
                setData(s => ({
                    ...s,
                    select: list[index - 1].id,
                    selectType: "up"
                }));
            } else if (key === "ArrowDown" && index !== list.length - 1) {
                e.preventDefault();
                setData(s => ({
                    ...s,
                    select: list[index + 1].id,
                    selectType: "down"
                }));
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            status && inputRef.current.focus();
        });
    }, [status]);

    return (
        <Modal
            className={styled["cash-dialog-vip"]}
            title="会员查询"
            visible={status}
            onCancel={closeModal}
            destroyOnClose={true}
            width={600}
            okButtonProps={{
                disabled: value.trim().length === 0,
                loading: btnLoading
            }}
        >
            <Search
                ref={inputRef}
                value={value}
                placeholder="请在此输入会员信息..."
                onKeyDown={handleKey}
                onSearch={handleSearch}
                onChange={handleInput}
            />
            {data.list.length > 0 && <List
                {...data}
                handleClick={handleClickSelect}
            />}
        </Modal>
    );
}