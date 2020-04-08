import React from "react";
import styled from "../../../../styles/home.scss";
import { CountCard } from "./common/CountCard";
import { LineCharts } from "./common/LineCharts";
import { useMemo } from "react";

function getLineChartsOption(source) {
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
            source
        },
        series: [
            {
                name: "销售",
                type: "line",
                encode: { x: 0, y: 1 },
                smooth: true
            },
            {
                name: "数量",
                type: "line",
                encode: { x: 0, y: 2 },
                smooth: true
            }
        ],
        tooltip: {
            trigger: "axis"
        },
        legend: {
            data: [
                "销售",
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

export function Cashier({
    status,
    data
}) {

    const { sale_price, order_count, count, vip_order_count, weekend_data } = data;

    const cardConfig = [
        {
            label: "今日收款额(元)",
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


    function handleCss(css) {
        if (status) {
            return [css, styled["has-padding"]].join(" ");
        }

        return css;
    }

    const Option = useMemo(() => getLineChartsOption(weekend_data), [weekend_data]);

    return (
        <>
            <CountCard
                config={cardConfig}
                cssHook={handleCss}
            />
            <div className={handleCss(styled["charts"])}>
                <LineCharts Option={Option} />
            </div>
        </>
    );
}