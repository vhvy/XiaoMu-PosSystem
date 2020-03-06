import React from "react";
import styled from "../../../../../styles/statistics/sales.scss";
import { Input, Select, Button, Icon } from "antd";

const { Search } = Input;
const { Option } = Select;

function Navigation({
    index,
    data,
    next,
    prev
}) {

    return (
        <div className={styled["navigation"]}>
            <Button.Group className={styled["btn-wrap"]}>
                <Button type="primary" onClick={prev} disabled={data.length <= 1}>
                    <Icon type="left" />
                    上一条
                </Button>
                <Button type="primary" onClick={next} disabled={data.length <= 1}>
                    下一条
                    <Icon type="right" />
                </Button>
            </Button.Group>

            <p className={styled["count"]}>{index + 1} / {data.length}</p>
        </div>
    );
}

export function OrderFn({
    BaseModal,
    typeList,
    currentType,
    handleTypeChange,
    handleSearch,
    searchData,
    next,
    prev
}) {

    const { data, index } = searchData;

    return (
        <div className={styled["sales-fn-wrap"]}>
            {BaseModal}
            <Select
                value={currentType}
                onChange={handleTypeChange}
                className={styled["select-wrap"]}
            >
                {
                    typeList.map(i => (
                        <Option value={i} key={i}>{i}</Option>
                    ))
                }
            </Select>
            <Search
                className={styled["search-wrap"]}
                placeholder="请在此输入要查询的数据..."
                onSearch={handleSearch}
            />
            {
                data.length > 0 && (
                    <Navigation
                        index={index}
                        data={data}
                        next={next}
                        prev={prev}
                    />
                )
            }
        </div>
    );
}