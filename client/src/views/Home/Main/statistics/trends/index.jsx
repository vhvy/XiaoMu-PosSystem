import React, { useState, useEffect, useMemo } from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { useTime } from "../hooks/useTime";
import { TrendsFn } from "./TrendsFn";
import { LoadingBox } from "../../../../../components/LoadingBox";
import { useAjax } from "../../../../AjaxProvider";
import { StatisticsTasks } from "../../../../../tasks/statistics";
import { LineCharts } from "./LineCharts";
import { notification } from "antd";

const queryTypeList = [
    {
        label: "按小时",
        value: "hour",
        checkFn: ([start_time_stamp, end_time_stamp]) => {
            // 最大可以查询24小时的范围

            const maxTime = 24 * 60 * 60 * 1000;
            if (Number(end_time_stamp) - Number(start_time_stamp) > maxTime) {
                notification.warn({
                    message: "超出查询范围",
                    description: "按小时查询时最多可查询24小时的数据，超出将仅查询结束时间当天24小时的数据。"
                });
            }
        }
    },
    {
        label: "按天",
        value: "day",
        checkFn: ([start_time_stamp, end_time_stamp]) => {
            // 最大可以查询366天的范围

            const maxTime = 366 * 24 * 60 * 60 * 1000;
            if (Number(end_time_stamp) - Number(start_time_stamp) > maxTime) {
                notification.warn({
                    message: "超出查询范围",
                    description: "按小时查询时最多可查询366天的数据，超出将仅查询结束时间之前366天的数据。"
                });
            }
        }
    },
    {
        label: "按月",
        value: "month",
        checkFn: ([start_time_stamp, end_time_stamp]) => {
            // 最大可以查询12个月的范围

            const maxTime = 12 * 31 * 24 * 60 * 60 * 1000;
            if (Number(end_time_stamp) - Number(start_time_stamp) > maxTime) {
                notification.warn({
                    message: "超出查询范围",
                    description: "按小时查询时最多可查询12个月的数据，超出将仅查询结束时间之前12个月的数据。"
                });
            }
        }
    }
];

export function Trends() {

    const ajax = useAjax();

    const [queryType, setQueryType] = useState(queryTypeList[1].value);
    // 当前查询类型

    const [trendData, setTrendData] = useState({
        data: [],
        load: true
    });
    // 销售趋势数据

    const [ChangeTimeBtn, timerange] = useTime();
    // 时间范围

    async function getTrendData() {

        !trendData.load && setTrendData(s => ({
            ...s,
            load: true
        }));
        // 请求数据时打开load动画

        const { checkFn } = queryTypeList.find(i => i.value === queryType);

        checkFn(timerange);

        try {
            const { data } = await StatisticsTasks.querySalesTrends(ajax, timerange, queryType);

            setTrendData(s => ({
                ...s,
                data,
                load: false
            }));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTrendData();
    }, [timerange, queryType]);

    const Charts = useMemo(() => {

        const keys = ["time", "sale_price", "in_price", "profit", "count"];

        let values = trendData.data.map(vl => keys.map(key => vl[key] || 0));

        return (<LineCharts
            data={values}
            type={queryTypeList.find(i => i.value === queryType).label}
            timerange={timerange}
        />);
    }, [trendData.data]);

    return (
        <div className={styled["sales-wrap"]}>
            <TrendsFn
                changeTimeBtn={ChangeTimeBtn}
                typeList={queryTypeList}
                setType={setQueryType}
                type={queryType}
            />
            <div className={styled["sales-proportion-body"]}>
                <LoadingBox status={trendData.load} />
                {Charts}
            </div>
        </div>
    );
}