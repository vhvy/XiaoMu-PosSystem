import React, { useMemo } from "react";
import styled from "../../../../styles/home.scss";
import { CountCard } from "./common/CountCard";
import { PieCharts } from "./common/PieCharts";
import { LineCharts } from "./common/LineCharts";

function getLineChartsOption(data) {

    const dataSource = data && data.map(({ time, sale_price = 0, in_price = 0, profit = 0, count = 0 }) => (
        [time, sale_price, in_price, profit, count]
    )) || [];



    return {
        title: {
            text: "7天销售趋势分析",
            top: 10,
            left: 10
        },
        xAxis: {
            type: "category"
        },
        grid: {
            top: 80
        },
        yAxis: {},
        dataset: {
            source: dataSource
        },
        series: [
            {
                name: "销售",
                type: "line",
                encode: { x: 0, y: 1 },
                smooth: true
            },
            {
                name: "成本",
                type: "line",
                encode: { x: 0, y: 2 },
                smooth: true
            },
            {
                name: "毛利",
                type: "line",
                encode: { x: 0, y: 3 },
                smooth: true
            },
            {
                name: "数量",
                type: "line",
                encode: { x: 0, y: 4 },
                smooth: true
            }
        ],
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: [
                "销售",
                "成本",
                "毛利",
                "数量"
            ],
            top: 40
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    pixelRatio: 2,
                    name: "7天销售情况分析",
                }
            }
        }
    };
}

export function Admin({
    status,
    data
}) {

    const {
        category_data,
        weekend_data,
        sale_price,
        order_count,
        count,
        vip_order_count
    } = data;

    const cardConfig = [
        {
            label: "今日销售额(元)",
            value: sale_price,
            icon: "icon-Moneygrowth",
            color: "#40c9c6"
        },
        {
            label: "今日订单数(笔)",
            value: order_count,
            icon: "icon-dingdan",
            color: "#36a3f7"
        },
        {
            label: "销售商品数量",
            value: count,
            icon: "icon-shangpin-",
            color: "#f4516c"
        },
        {
            label: "会员订单数(笔)",
            value: vip_order_count,
            icon: "icon-A",
            color: "#40c9c6"
        }
    ];

    const Option = useMemo(() => getLineChartsOption(weekend_data), [weekend_data]);

    function handleCss(css) {
        if (status) {
            return [css, styled["has-padding"]].join(" ");
        }

        return css;
    }

    const base_category_data = category_data && category_data.length !== 0 && category_data || [
        {
            name: "暂无数据",
            value: 0
        }
    ];

    return (
        <>
            <CountCard
                config={cardConfig}
                cssHook={handleCss}
            />
            <div className={handleCss(styled["charts"])}>
                <PieCharts data={base_category_data} />
                <LineCharts Option={Option} />
            </div>
        </>
    );
}