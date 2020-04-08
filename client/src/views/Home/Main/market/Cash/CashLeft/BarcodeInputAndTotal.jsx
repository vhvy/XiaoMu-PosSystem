import React, { useRef, useEffect, useState } from "react";
import { Modal, Input, } from "antd";
import styled from "../../../../../../styles/cash.scss";
import { useAjax } from "../../../../../AjaxProvider";
import { CommodityTasks } from "../../../../../../tasks/commodity";
import { SelectCommodity } from "../Dialog/SelectCommodity";
import { ClientDisplay } from "../../../../../../device/client_display";

const { Search } = Input;

function formatValue(value) {
    const str = String(value);
    const index = str.indexOf(".");
    if (index === -1) {
        return (
            <span className={styled["value"]}>
                {str}
            </span>
        );
    }

    const int = str.slice(0, index);
    const float = str.slice(index + 1);
    return (
        <span className={styled["value"]}>
            {int}.
            <span className={styled["float"]}>{float}</span>
        </span>
    );
}

export function BarcodeInputAndTotal({
    addCommodity,
    value,
    setValue,
    hotkey,
    count,
    money
}) {

    const ajax = useAjax();

    useEffect(() => {
        ClientDisplay.show({
            all_price: money
        });
        // 通过客显显示当前订单价格
    }, [money]);

    const inputRef = useRef(null);
    const [selectCommodityData, setSelectCommodityData] = useState({
        show: false,
        list: []
    });

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    function closeSelectCommodity(args) {
        // 隐藏选择商品对话框

        setSelectCommodityData({
            show: false,
            list: []
        });

        if (args) {
            addCommodity(args);
        }
        setValue("");
    }

    function handleHotKey(e) {
        const { key } = e;
        const item = hotkey.find(t => t.key === key);
        item && (() => {
            e.preventDefault();
            item.fn();
        })();
    }

    function handleChange({ target }) {
        setValue(target.value);
    }

    async function queryCommodity() {
        if (value === "" || value.trim() === "") return;
        try {
            const { data } = await CommodityTasks.query(ajax, value.trim().toUpperCase());
            if (data.length === 0) {
                Modal.error({
                    title: `找不到 ${value}相关的商品信息!`,
                    autoFocusButton: null,
                    okText: "关闭"
                });
            } else if (data.length === 1) {
                const [details] = data;
                if (details.is_delete) {
                    Modal.error({
                        title: "此商品已被下架，无法销售!"
                    });
                } else if (details.sale_price === 0) {
                    Modal.error({
                        title: "此商品尚未设置销售价格，请联系管理员!"
                    });
                } else {
                    addCommodity(details);
                    setValue("");
                }
            } else {
                setSelectCommodityData(s => ({
                    ...s,
                    list: data,
                    show: true
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styled["cash-top"]}>
            <Search
                className={styled["input-wrap"]}
                value={value}
                ref={inputRef}
                style={{ width: 250 }}
                onChange={handleChange}
                onKeyDown={handleHotKey}
                onSearch={queryCommodity}
            />
            <div className={styled["cash-total"]}>
                <p>数量:&nbsp;&nbsp;
                    {
                        formatValue(count)
                    }
                </p>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <p>总价:&nbsp;&nbsp;
                    {
                        formatValue(money)
                    }
                </p>
            </div>
            <SelectCommodity data={selectCommodityData} closeFn={closeSelectCommodity} />
        </div>
    );
}