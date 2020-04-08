import React, { useEffect, useState } from "react";
import { useTime } from "../hooks/useTime";
import styled from "../../../../../styles/statistics/sales.scss";
import { useAjax } from "../../../../AjaxProvider";
import { LoadingBox } from "../../../../../components/LoadingBox";
import { StatisticsTasks } from "../../../../../tasks/statistics";
import { ProportionFn } from "./ProportionFn";
import { useCategories } from "../../../../../hooks/useCategories";
import copyObj from "../../../../../tools/copyObj";
import { PieChart } from "./PieCharts";
import { useMemo } from "react";

const options = [
    {
        value: "category",
        label: "商品分类",
        children: [
            {
                value: "all",
                label: "全部父分类"
            }
        ]
    },
    {
        value: "vip",
        label: "是否会员"
    },
    {
        value: "pos_user",
        label: "收银员"
    },
    {
        value: "pay_type",
        label: "支付方式"
    },
    {
        value: "supplier",
        label: "供货商"
    }
];

function getFormatType(list) {
    // 获取格式化的type类型

    const [parent, child] = list;

    const { label, children } = options.find(i => i.value === parent);

    let result = [label];
    if (child) {
        // 有子分类时

        const childItem = children.find(i => i.value === child);
        // 查找子分类是否含有预设的label

        result.push(
            childItem ? childItem.label : child
        );
    }

    return result;
}


export function Proportion() {

    const ajax = useAjax();

    const [parent_categories] = useCategories({
        ajax,
        onlyHasChild: true
    });
    // 商品分类信息

    const [typeOption, setTypeData] = useState(options);
    // 查询类型数据

    const [currentType, setCurrentType] = useState([
        typeOption[0].value,
        typeOption[0].children[0].value
    ]);

    const [propData, setPropData] = useState({
        status: true,
        data: []
    });
    // 占比数据

    const [ChangeTimeBtn, timerange] = useTime();
    async function getData() {
        // 当时间段范围发生变化时刷新数据

        !propData.status && setPropData(s => ({
            ...s,
            status: true
        }));
        // 请求数据时，打开load动画

        try {
            const { data } = await StatisticsTasks.queryCommoditySalesProportionByTime(ajax, timerange, currentType);

            setPropData(s => ({
                ...s,
                status: false,
                data
            }));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, [timerange, currentType]);

    useEffect(() => {

        const copyState = copyObj(typeOption);
        const category_config = copyState.find(i => i.value === "category");

        if (parent_categories.length === 0 && category_config.children.length === 0) return;

        for (let { name } of parent_categories) {
            category_config.children.push({
                value: name,
                label: name,
            });
        }

        setTypeData(copyState);
    }, [parent_categories]);

    const Charts = useMemo(() => (
        <PieChart
            data={propData.data}
            type={getFormatType(currentType)}
            timerange={timerange}
        />
    ), [propData.data]);
    // 饼状图表

    return (
        <div className={styled["sales-wrap"]}>
            <ProportionFn
                changeTimeBtn={ChangeTimeBtn}
                setCurrentType={setCurrentType}
                option={typeOption}
                currentType={currentType}
            />
            <div className={styled["sales-proportion-body"]}>
                <LoadingBox status={propData.status} />
                {Charts}
            </div>
        </div>
    );
}