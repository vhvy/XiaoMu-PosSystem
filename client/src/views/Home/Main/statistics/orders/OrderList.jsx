import React from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { VirtualSelectList } from "../../../../../components/VirtualSelectList";
import { useMemo } from "react";
import { mathc } from "../../../../../tools/mathc";
import { getFormatTime } from "../../../../../tools/time";
import { LoadingBox } from "../../../../../components/LoadingBox";

const columns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "订单号",
        key: "order_id",
        type: 2
    },
    {
        title: "结算时间",
        key: "date",
        type: 2
    },
    {
        title: "状态",
        key: "status",
        type: 3
    },
    {
        title: "会员卡号",
        key: "vip_code",
        type: 3
    },
    {
        title: "商品数量",
        key: "count",
        type: 3
    },
    {
        title: "订单成本",
        key: "in_price",
        type: 3
    },
    {
        title: "订单金额",
        key: "sale_origin_price",
        type: 3
    },
    {
        title: "实际售价",
        key: "sale_price",
        type: 3
    },
    {
        title: "顾客付款",
        key: "client_pay",
        type: 3
    },
    {
        title: "找零",
        key: "change",
        type: 3
    },
    {
        title: "支付方式",
        key: "pay_type",
        type: 3
    },
    {
        title: "本单利润",
        key: "profit",
        type: 3
    },
    {
        title: "利润率",
        key: "profit_rate",
        type: 3
    },
    {
        title: "收银员",
        key: "username",
        type: 3
    }
];

const haveDataColumns = [
    "in_price",
    "sale_origin_price",
    "sale_price",
    "client_pay",
    "change",
    "profit"
];

// 底部栏目需要数据的key

function getFooterColumns(data) {
    // 计算底部栏目数据

    let footerColumns = [
        {
            title: "共计",
            type: 1,
            value: data.length || 0
        }
    ];

    for (let i = 1; i < columns.length; i++) {
        const { title, key, type } = columns[i];
        footerColumns.push({
            title,
            type,
            value: haveDataColumns.includes(key) ? data[key] : ""
        });
    }

    return footerColumns;
}

export function OrderList({
    order_list,
    selectId,
    selectType,
    load,
    handleClick
}) {

    const [data, footerData] = useMemo(() => {
        let data = [];
        let footerData = {
            length: order_list.length
        };

        for (let key of haveDataColumns) {
            footerData[key] = 0;
        }

        function getRate(profit, sale_price) {

            if (sale_price === 0) return "-100%";

            const value = mathc.formatRate(mathc.divide(
                profit, sale_price
            ));

            if (profit < 0) return "-" + value;

            return value;
        }

        order_list.forEach(({ check_date, is_undo, ...fields }) => {
            data.push({
                ...fields,
                status: is_undo ? "撤销" : "正常",
                date: getFormatTime(check_date),
                profit_rate: getRate(
                    fields["profit"],
                    fields["sale_price"]
                )
            });

            for (let key of haveDataColumns) {
                footerData[key] = mathc.add(footerData[key], fields[key]);
            }
        });

        return [data, footerData];
    }, [order_list]);

    const footerColumn = useMemo(() => getFooterColumns(footerData), [footerData]);

    return (
        <div
            className={styled["order-list"]}
        >
            <LoadingBox
                status={load}
            />
            <VirtualSelectList
                wrapCss={styled["order-list-cont"]}
                data={data}
                selectType={selectType}
                select={selectId}
                columns={columns}
                footerColumn={footerColumn}
                handleClickSelect={handleClick}
            />
        </div>
    );
}