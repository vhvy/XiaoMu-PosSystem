import React, { useEffect, useState } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
import styled from "../../../../../styles/statistics/sales.scss";
import { getFormatTime } from "../../../../../tools/time";

let reflowFlag = false;
// 已经触发重绘的flag

export function PieChart({
    data,
    type,
    timerange
}) {

    const typeText = type.join("/");

    const timeRangeText = timerange.map(t => getFormatTime(t)).join(" - ");

    const [myChart, setMyChart] = useState();

    const Option = {
        title: {
            text: `销售占比分析 - ${typeText}`,
            subtext: timeRangeText,
            top: 10,
            left: 10,
        },
        tooltip: {
            trigger: "item",
            formatter: "{a}<br />{b}: {c}元 (占比: {d}%)"
        },
        series: [
            {
                name: typeText,
                type: "pie",
                radius: 150,
                label: {
                    formatter: "{b}: {c}元 ({d}%)"
                },
                data,
            }
        ],
        legend: {
            type: "scroll",
            orient: "vertical",
            left: 10,
            top: 80,
            bottom: 20,
        },
        animationEasing: "backOut"
    };

    useEffect(() => {
        const myChart = echarts.init(document.querySelector("#echart-pie-wrap"));
        // echarts实例

        setMyChart(myChart);
        // 将实例写入state

        window.addEventListener("resize", myChart.resize);
        // 监听窗口变化事件

        return () => window.removeEventListener("resize", myChart.resize);
    }, []);

    useEffect(() => {

        if (!reflowFlag && myChart) {
            // 没有触发过重绘，则进行重绘制

            myChart.resize();

            reflowFlag = true;
        }

        myChart && myChart.setOption(Option);
    }, [data]);

    return (
        <div
            id="echart-pie-wrap"
            className={styled["echart-pie-wrap"]}
        />
    );
}