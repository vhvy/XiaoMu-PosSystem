import React, { useMemo, useState } from "react";
import { CommodityList } from "./CommodityList";
import { SearchFn } from "./SearchFn";
import { SearchResult } from "./SearchResult";
import styled from "../../../../../styles/warehouse/barcodeprint.scss";
import { Button, Icon, message, Modal } from "antd";
import { useAjax } from "../../../../AjaxProvider";
import { CommodityTasks } from "../../../../../tasks/commodity";
import { CommodityTagPrint } from "../../../../../device/commodity_tag_print";

const initPrintState = {
    list: [],
    selectId: -1,
    selectType: "origin"
};

const initQueryState = {
    list: [],
    selectId: -1,
    selectType: "origin"
};

let printIdFlag = 0;

export function BarcodePrint() {

    const ajax = useAjax();

    const [printCommodityData, setPrintCommodityData] = useState(initPrintState);
    // 待打印商品数据

    const [queryCommodityData, setQueryCommodityData] = useState(initQueryState);
    // 当前查询商品数据

    function handlePrintClick(selectId) {
        // 处理待打印列表选中

        setPrintCommodityData(s => ({
            ...s,
            selectId,
            selectType: "click"
        }));
    }

    function handleQueryClick(selectId) {
        // 处理待查询列表选中

        setQueryCommodityData(s => ({
            ...s,
            selectId,
            selectType: "click"
        }));
    }

    function handleDel() {
        // 删除当前商品

        const { selectId, list } = printCommodityData;

        if (list.length === 1) {
            // 如果当前打印列表内商品数量为1， 则为直接清空所有数据

            return handleClean();
        }


        const index = list.findIndex(i => i.id === selectId);
        // 当前选中商品索引

        let nextSelectId = -1;

        if (index === list.length - 1) {
            // 当前商品为打印列表最后一个商品
            // 设置选中id为列表上一个商品id

            nextSelectId = list[index - 1].id;
        } else {
            // 设置选中id为列表下一个商品id

            nextSelectId = list[index + 1].id;
        }

        setPrintCommodityData(s => ({
            ...s,
            list: s.list.filter(i => i.id !== selectId),
            selectId: nextSelectId,
            selectType: "click"
        }));
    }

    function handlePrint() {
        // 打印商品标签

        async function print(cb) {
            await CommodityTagPrint.print(printCommodityData.list);
            message.success("打印完成!");
            cb();
        }

        Modal.confirm({
            title: "确定要开始打印吗?",
            okText: "打印",
            onOk: print
        });
    }

    function handleClean() {
        // 清空所有待打印商品

        setPrintCommodityData(initPrintState);
    }

    function handleAdd() {
        // 添加所选商品到待打印列表

        const { selectId, list } = queryCommodityData;

        const commodity = list.find(i => i.id === selectId);
        // 当前选中商品

        const newId = printIdFlag++;
        // 新的选中id， 防止添加多个相同id商品

        setPrintCommodityData(s => ({
            ...s,
            list: [...s.list, { ...commodity, id: newId }],
            selectId: newId,
            selectType: "down"
        }));
    }

    async function handleSearch(_query, selectInput) {
        // 查询商品

        const query = _query.trim();

        if (query === "") {

            queryCommodityData.list.length !== 0 && setQueryCommodityData(initQueryState);
            // 当查询字符为空且当前查询列表拥有数据时清空查询商品列表

            return;
        }

        function handleQueryData(data) {
            // 打印多个同条码商品会出现id相同的情况
            // 对id进行自增处理

            if (data.length === 0) return data;

            return data.map(i => ({
                ...i,
                id: printIdFlag++
            }));
        }

        try {
            const { data } = await CommodityTasks.query(ajax, query);

            const base_data = handleQueryData(data);

            if (base_data.length === 0) {
                return message.warn("没有找到任何商品!");
            }

            if (base_data.length === 1) {
                // 精准匹配到一个商品，则直接填充入打印列表

                const item = base_data[0];

                setPrintCommodityData(s => ({
                    ...s,
                    list: [...s.list, item],
                    selectId: item.id,
                    selectType: "up"
                }));

            } else {
                // 匹配到多个商品，填充入查询结果列表待选择

                setQueryCommodityData(s => ({
                    ...s,
                    list: base_data,
                    selectId: base_data[0].id,
                    selectType: "up"
                }));
            }

            selectInput();
            // 选中当前输入字符
        } catch (error) {
            console.log(error);
        }

    }

    const btnList = [
        {
            label: "删除商品",
            type: "danger",
            fn: handleDel,
            disabled: printCommodityData.selectId === -1,
            icon: "minus-circle"
        },
        {
            label: "清空商品",
            type: "danger",
            fn: handleClean,
            disabled: printCommodityData.list.length === 0,
            icon: "delete"
        },
        {
            label: "添加商品",
            fn: handleAdd,
            disabled: queryCommodityData.selectId === -1,
            icon: "plus"
        },
        {
            label: "打印标签",
            fn: handlePrint,
            disabled: printCommodityData.list.length === 0,
            icon: "printer"
        }
    ];
    // 功能区域按钮配置列表

    return (
        <div className={styled["barcodeprint-wrap"]}>
            <SearchFn handleSearch={handleSearch}>
                {
                    useMemo(() => btnList.map(({ label, type = "primary", fn, disabled, icon }) => (
                        <Button key={label} onClick={fn} type={type} disabled={disabled}>
                            <Icon type={icon} />
                            {label}
                        </Button>))
                    )
                    // 功能区域按钮列表}
                }
            </SearchFn>
            <SearchResult
                handleClick={handleQueryClick}
                {...queryCommodityData}
            />
            <CommodityList
                handleClick={handlePrintClick}
                {...printCommodityData}
            />
        </div>
    );
}