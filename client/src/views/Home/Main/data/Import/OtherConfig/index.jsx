import React, { useMemo, useState } from "react";
import styled from "../../../../../../styles/data/import.scss";
import { ValuePair } from "./ValuePair";
import { RightContent } from "./RightContent";
import copyObj from "../../../../../../tools/copyObj";

export function OtherConfig({
    status,
    config,
    setFileStatus,
    option,
    data,
    type,
    fields,
    rules,
    mapFields,
    mapValueList,
    setMapValueList
}) {

    const show_mapFields = useMemo(() => {
        // 筛选出导入数据的有效属性名中可以进行转换的属性

        const keys = Object.keys(config.data[0]);
        // 导入数据的所有有效属性名

        return mapFields.filter(({ field }) => keys.includes(field));
    }, [mapFields]);


    const [currentField, setCurrentField] = useState(() => {

        const field = show_mapFields[0].field;

        const value_list = [];

        config.data.forEach(i => {
            const v = i[field];
            !value_list.includes(v) && value_list.push(v);
        });

        return {
            field,
            // 当前选中要转换的属性

            value_list: value_list,
            // 当前选中要转换的属性值列表

            value: value_list[0]
            // 当前选中的要转换的属性值
        };
    });



    function handleCurrentField(field = show_mapFields[0].field) {
        // 设置当前选中属性名
        // 同时更新相应属性值列表

        const base_value_list = mapValueToList(field);
        // 根据属性名筛选出所有的属性值

        const value_list = filterValueList(field, base_value_list);
        // 筛选出所有没有映射过的属性值


        setCurrentField({
            field,
            value_list,
            value: value_list[0]
        });
    }

    function mapValueToList(field) {
        const { data } = config;
        let list = [];
        data.forEach(i => {
            const v = i[field];
            !list.includes(v) && list.push(v);
        });
        return list;
    }

    function filterValueList(field, list) {
        // 从当前选中属性值列表中筛选出尚未映射的值

        const item = mapValueList.find(i => i.field === field);

        if (!item) return list;

        const values = item.values.map(({ value }) => value);
        return list.filter(v => !values.includes(v));
    }

    function handleCurrentValue(value) {
        // 设置当前选中属性值

        setCurrentField(s => ({
            ...s,
            value
        }));
    }

    function handleAddMapValue(_new_value) {
        // 向映射列表里添加一条新的记录
        const new_value = _new_value.trim ? _new_value.trim() : _new_value;
        const { field, value } = currentField;
        const { label } = show_mapFields.find(i => i.field === field);
        setMapValueList(s => {
            const state = copyObj(s);
            const item = state.find(i => i.field === field);

            if (item) {
                // 当此属性名已经存在时

                const value_item = item.values.find(i => i.value === value);
                // 从值列表里查找对应的原始值

                if (value_item) {
                    // 当此原始值存在时
                    value_item.new_value = new_value;
                } else {
                    // 当此原始值不存在时
                    item.values.push({
                        value,
                        new_value
                    });
                }

                return state;
            } else {
                // 当此属性名不存在时
                return [
                    ...state,
                    {
                        field,
                        label,
                        values: [
                            {
                                value,
                                new_value
                            }
                        ]
                    }
                ];
            }
        });
    }

    function handleDeleteMapValue(field, value) {
        // 从已映射列表里删除一条记录
        // field 字段，属性名
        // value 字段的原始属性值

        setMapValueList(s => {
            const state = copyObj(s);
            return state.reduce((a, b) => {
                if (b.field !== field) return [...a, b];
                // 不是当前属性则直接返回数据

                const values = b.values.filter(i => i.value !== value);
                // 筛选出不是当前值的值列表

                if (values.length === 0) return a;
                // 如果值列表唯空则删除此属性，直接返回原列表

                return [...a, {
                    field,
                    values
                }];
            }, []);
        });
    }


    const MapList = (
        <div className={styled["left-map-wrap"]}>
            <div className={styled["left-map-title"]}>
                <p>属性</p>
                <p>转换值</p>
            </div>
            <div
                className={styled["left-map-list"]}
            >
                {
                    mapValueList.map(({ field, values, label }) => (
                        <ValuePair
                            field={field}
                            label={label}
                            values={values}
                            key={field}
                            handleDelete={handleDeleteMapValue}
                        />
                    ))
                }
            </div>
            <div className={styled["left-map-footer"]}>
                <p>{mapValueList.length}</p>
                <p>{mapValueList.reduce((a, { values }) => a + values.length, 0)}</p>
            </div>
        </div>
    );

    return (
        <div
            className={styled["other-config-wrap"]}
        >
            {
                !status && <p>正在转换数据，请稍候...</p>
            }
            {
                status && MapList
            }
            {
                status && (
                    <RightContent
                        handleCurrentField={handleCurrentField}
                        handleCurrentValue={handleCurrentValue}
                        handleAddMapValue={handleAddMapValue}
                        currentField={currentField}
                        show_mapFields={show_mapFields}
                        setMapValueList={setMapValueList}
                    />
                )
            }
        </div>
    );
}