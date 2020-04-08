import React, { useState, useEffect } from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/toolbox";
import { getFormatTime } from "../../../../../tools/time";

let reflowFlag = false;
// 已经触发重绘的flag

export function LineCharts({
    data,
    type,
    timerange,
}) {

    const timeRangeText = timerange.map(t => getFormatTime(t)).join(" - ");

    const [myChart, setMyChart] = useState();

    const Option = {
        title: {
            text: `销售趋势分析 - ${type}`,
            subtext: timeRangeText,
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
            source: data
        },
        series: [
            {
                name: "销售",
                type: "line",
                encode: { x: 0, y: 1 }
            },
            {
                name: "成本",
                type: "line",
                encode: { x: 0, y: 2 }
            },
            {
                name: "毛利",
                type: "line",
                encode: { x: 0, y: 3 }
            },
            {
                name: "数量",
                type: "line",
                encode: { x: 0, y: 4 }
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
            top: 30
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    pixelRatio: 2,
                    name: `销售趋势分析 - ${type}(${timeRangeText})`,
                }
            }
        }
    };

    useEffect(() => {
        const myChart = echarts.init(document.querySelector("#echart-line-wrap"));
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
            id="echart-line-wrap"
            className={styled["echart-wrap"]}
        />
    );
}