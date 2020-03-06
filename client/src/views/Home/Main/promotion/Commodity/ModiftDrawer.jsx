import React, { useState, useMemo, useEffect } from "react";
import { Drawer, Form, Input, Select, InputNumber, Button, message } from "antd";
import { CommodityTasks } from "../../../../../tasks/commodity";
import { PromotionManage } from "../../../../../tasks/promotion";

const { Search } = Input;
const { Option } = Select;

function _ModifyDrawer({
    status = false,
    type,
    closeFn,
    selectCommodity,
    ajax,
    promoTypeList,
    form,
    currentPromo,
    setCommodityList
}) {

    const { getFieldDecorator, isFieldsTouched, isFieldTouched, getFieldsError, getFieldValue } = form;

    const [queryCommodity, setQueryCommodity] = useState();
    // 增加上商品模式下 查询到的商品

    const currentCommodity = useMemo(() => {
        return type === "add" ? (queryCommodity ? queryCommodity : {}) : selectCommodity;
    }, [queryCommodity, selectCommodity, type]);
    // 当前展示在表单中的商品信息



    const required_field = ["discount_value", "promotion_type"];

    function hasError() {

        if (!isFieldsTouched()) return true;

        if (type === "add") {
            for (let field of required_field) {
                if (!isFieldTouched(field)) return true;
            }
        }


        const errors = getFieldsError();
        const keys = Object.keys(errors);
        for (let key of keys) {
            if (errors[key]) return true;
        }

        return false;
    }

    const config = [
        {
            type: "add",
            title: "新增促销商品",
            okText: "新增",
            disabled: hasError(),
            onOk: addCommodityToPromo
        },
        {
            type: "edit",
            title: "编辑促销商品",
            okText: "保存",
            disabled: hasError(),
            onOk: editCommodityFromPromo
        }
    ];

    const { title, okText, disabled, onOk } = config.find(i => i.type === type);

    async function addCommodityToPromo() {

        let commodity = {
            barcode: currentCommodity.barcode
        };


        for (let field of required_field) {
            commodity[field] = getFieldValue(field);
        }

        const values = {
            promotion_name: currentPromo,
            commodity
        };

        try {
            const { data } = await PromotionManage.addCommodityToPromo(ajax, values);
            console.log(data);

            setCommodityList(list => [...list, data]);
            message.success("商品添加完成!");
            closeFn();
        } catch (error) {
            console.log(error);
        }
    }

    async function editCommodityFromPromo() {

        let update_value = {};
        for (let field of required_field) {
            update_value[field] = getFieldValue(field);
        }

        const { barcode } = currentCommodity;

        const values = {
            promotion_name: currentPromo,
            barcode,
            update_value
        };

        try {
            const { data } = await PromotionManage.editCommodityFromPromo(ajax, values);

            setCommodityList(list => list.map(i => {
                if (i.barcode === barcode) return data;
                return i;
            }));

            message.success("商品修改成功!");
            closeFn();

        } catch (error) {
            console.log(error);
        }
    }

    async function handleSearch(_query) {
        const query = _query.trim();
        if (query === "") return;
        try {
            const { data } = await CommodityTasks.query(ajax, query, true);
            if (data.length === 0) {
                return message.warn("没有找到相关的商品!");
            }
            if (data[0].is_delete === 1) {
                return message.warn("此商品已被禁用!");
            }
            setQueryCommodity(data[0]);
        } catch (error) {
            console.log(error);
        }

    }

    const children = [
        {
            id: "barcode",
            label: "查询商品",
            show: type === "add",
            required: false,
            component: (
                <Search
                    placeholder="请在此输入商品的准确信息进行查询"
                    onSearch={handleSearch}
                />
            )
        },
        {
            id: "name",
            label: "商品名称",
            show: !!currentCommodity.name,
            controlled: false,
            component: (
                <Input
                    value={currentCommodity.name}
                    disabled
                />
            )
        },
        {
            id: "in_price",
            label: "商品进价",
            show: !!currentCommodity.name,
            controlled: false,
            component: (
                <Input
                    value={currentCommodity.in_price}
                    disabled
                />
            )
        },
        {
            id: "sale_price",
            label: "商品售价",
            show: !!currentCommodity.name,
            controlled: false,
            component: (
                <Input
                    value={currentCommodity.sale_price}
                    disabled
                />
            )
        },
        {
            id: "promotion_type",
            label: "促销类型",
            show: !!currentCommodity.name,
            initialValue: currentCommodity.promotion_type_name,
            component: (
                <Select>
                    {
                        promoTypeList.map(i => (
                            <Option
                                key={i}
                                value={i}
                            >
                                {i}
                            </Option>
                        ))
                    }
                </Select>
            )
        },
        {
            id: "discount_value",
            label: "折扣/售价",
            show: !!currentCommodity.name,
            initialValue: currentCommodity.discount_value,
            component: (
                <InputNumber
                    step={0.01}
                // precision
                />
            )
        },
        {
            id: "btn",
            label: " ",
            show: !!currentCommodity.name,
            controlled: false,
            component: (
                <Button
                    onClick={onOk}
                    disabled={disabled}
                    type="primary"
                >
                    {okText}
                </Button>
            ),
            colon: false
        }
    ];

    const formLayout = {
        wrapperCol: {
            span: 15
        },
        labelCol: {
            span: 6
        }
    };

    useEffect(() => {
        status && type === "add" && setQueryCommodity(undefined);
    }, [status]);

    return (
        <Drawer
            visible={status}
            title={title}
            width={400}
            onClose={closeFn}
        >
            <Form
                {...formLayout}
            >
                {
                    children
                        .filter(({ show = true }) => show)
                        .map(({
                            id,
                            label,
                            controlled = true,
                            component,
                            colon = true,
                            initialValue,
                            required = true,
                            layout = {}
                        }) => (
                                <Form.Item label={label} key={id} colon={colon} {...layout}>
                                    {
                                        controlled ? getFieldDecorator(id, {
                                            initialValue,
                                            rules: [
                                                {
                                                    required,
                                                    message: "此属性不能省略!"
                                                }
                                            ]
                                        })(component) : component
                                    }
                                </Form.Item>
                            ))
                }
            </Form>
        </Drawer>
    );
}

export const ModifyDrawer = Form.create()(_ModifyDrawer);