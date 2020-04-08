import React, { useState, useEffect } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/toolbox";

let reflowFlag = false;
// 已经触发重绘的flag

export function PieCharts({ data }) {

    const [myChart, setMyChart] = useState();

    const Option = {
        title: {
            text: "分类占比分析",
            top: 10,
            left: 10,
        },
        tooltip: {
            trigger: "item",
            formatter: "{a}<br />{b}: {c}元 (占比: {d}%)"
        },
        series: [
            {
                name: "分类占比",
                type: "pie",
                radius: 110,
                label: {
                    formatter: "{b}: {c}元 ({d}%)"
                },
                data
            }
        ],
        animationEasing: "backOut",
        toolbox: {
            feature: {
                saveAsImage: {
                    pixelRatio: 2,
                    name: "销售占比分析",
                }
            }
        }
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
        />
    );
}