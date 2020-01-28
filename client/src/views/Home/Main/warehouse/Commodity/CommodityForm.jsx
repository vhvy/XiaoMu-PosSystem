import React, { useMemo, useState, useEffect } from "react";
import { Drawer, Form, Input, Row, Col, Switch, Button, message } from "antd";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { CustomSelectTree } from "../../../../../components/CustomSelectTree";
import { useAjax } from "../../../../AjaxProvider";
import { SupplierTask } from "../../../../../tasks/supplier";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { useRef } from "react";
import { CommodityTasks } from "../../../../../tasks/commodity";

const selector = ({ warehouse }) => ({
    tree: warehouse.categories.tree
});

function SupplierSelect({ value = "", handleChange }) {

    const [supplierList, setSupplierList] = useState([]);
    const ajax = useAjax();

    async function getSupplierList() {
        try {
            const { data } = await SupplierTask.getSupplier(ajax);
            setSupplierList(data);
            if (value === null) {
                // 如果为null 则设置为默认供货商
                handleChange(data[0].name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSupplierList();
    }, []);

    return (
        <CustomSelectTree
            placeholder="选择供应商"
            tree={supplierList}
            onChange={handleChange}
            value={value}
        />
    )
}


export function _BaseForm({ form, selectCommodity, initState, type, closeDrawer, flushFn, updateFn }) {



    const ajax = useAjax();
    const { tree } = useSelector(selector, shallowEqual);

    const {
        getFieldDecorator,
        getFieldsValue,
        getFieldsError
    } = form;

    const [categoryValue, setCategory] = useState(initState.category_name);
    // 分类值

    const [supplierValue, setSupplier] = useState(initState.supplier);
    // 供应商值
    
    const [isDelete, setIsDelete] = useState(initState.is_delete);
    // 是否禁用

    const [isVipPoints, setIsVipPoints] = useState(initState.vip_points);

    function setSupplierValue(v) {
        setSupplier(v);
    }

    function setCategoryValue(v) {
        setCategory(v);
    }

    const CategorySelectTree = (
        <CustomSelectTree
            tree={tree}
            value={categoryValue}
            onChange={setCategoryValue}
            placeholder="选择分类"
        />
    );

    const DeleteToggle = (
        <Switch
            onChange={setIsDelete}
            checked={isDelete}
        />
    );

    const VipPointsToggle = (
        <Switch
            onChange={setIsVipPoints}
            checked={isVipPoints}
        />
    );

    const inputRef = useRef(null);

    const BarcodeInput = getFieldDecorator("barcode", {
        rules: [
            {
                min: 5,
                max: 14,
                message: "请输入正确的条码!"
            }
        ],
        initialValue: initState.barcode
    })(
        <Input placeholder="留空则自动生成" ref={inputRef} />
    );

    useEffect(() => {
        status && setTimeout(() => {
            inputRef.current.focus();
            // 聚焦到条码输入框
        });
    }, [status]);

    const data = {
        ...(getFieldsValue()),
        category_name: categoryValue,
        supplier_name: supplierValue,
        is_delete: isDelete,
        vip_points: isVipPoints
    };

    const hasError = (() => {
        const errors = getFieldsError();
        const keys = Object.keys(errors);
        for (let key of keys) {
            if (errors[key] !== undefined) return true;
        }
        return false;
    })();

    const common = [
        {
            children:
                [
                    {
                        span: 11,
                        label: "条码",
                        id: "barcode",
                        component: BarcodeInput
                    },
                    {
                        span: 12,
                        label: "分类",
                        id: "category",
                        component: CategorySelectTree
                    }
                ]
        },
        {
            children: [
                {
                    label: "商品名称",
                    id: "name",
                    initialValue: initState.name,
                    rules: [
                        {
                            required: true,
                            message: "商品名称不能省略!"
                        },
                        {
                            min: 1,
                            max: 30,
                            message: "商品名长度应保持在1-30字间!"
                        }
                    ]
                }
            ]
        },
        {
            children: [
                {
                    span: 11,
                    label: "进价",
                    id: "in_price",
                    placeholder: "默认值为0",
                    initialValue: initState.in_price
                },

                {
                    span: 12,
                    label: "售价",
                    id: "sale_price",
                    placeholder: "默认值为0",
                    initialValue: initState.sale_price
                }

            ]
        },
        {
            children: [
                {
                    span: 11,
                    label: "简拼",
                    id: "pinyin",
                    placeholder: "留空则自动生成",
                    initialValue: initState.pinyin
                },
                {
                    span: 12,
                    label: "供货商",
                    id: "supplier",
                    component: useMemo(() => (
                        <SupplierSelect value={supplierValue} handleChange={setSupplierValue} />
                    ), [supplierValue])
                }
            ]
        },
        {
            children: [
                {
                    span: 11,
                    label: "单位",
                    id: "unit",
                    placeholder: "可留空不填",
                    initialValue: initState.unit
                },
                {
                    span: 12,
                    label: "规格",
                    id: "size",
                    placeholder: "可留空不填",
                    initialValue: initState.size
                }
            ]
        },
        {
            children: [
                {
                    span: 11,
                    label: "禁用",
                    id: "is_delete",
                    component: DeleteToggle,
                    labelAlign: "left",
                    layout: {
                        labelCol: {
                            span: 6
                        },
                        wrapperCol: {
                            span: 15
                        }
                    }
                },
                {
                    span: 12,
                    label: "是否积分",
                    id: "vip_points",
                    component: VipPointsToggle,
                    labelAlign: "left",
                    layout: {
                        labelCol: {
                            span: 10
                        },
                        wrapperCol: {
                            span: 12
                        }
                    }
                }
            ]
        },
    ];

    function renderCol(arr) {
        return arr.map(({ span = 24, label, id, component, labelAlign, placeholder, layout = {}, rules, initialValue }) => (
            <Col span={span} key={id} >
                <Form.Item
                    label={label}
                    labelAlign={labelAlign}
                    {...layout}
                >
                    {
                        component ? component : getFieldDecorator(id, {
                            rules,
                            initialValue
                        })(
                            <Input placeholder={placeholder} />
                        )
                    }
                </Form.Item>
            </Col>
        ));
    }

    function renderRow(arr) {
        return arr.map(({ type = "flex", justify = "space-between", children }, index) => (
            <Row
                key={index}
                type={type}
                justify={justify}
            >
                {renderCol(children)}
            </Row>
        ));
    }

    const allowSubmit = !hasError && data["name"] && data["name"].trim().length >= 1 && data["category_name"] && data["category_name"].trim().length >= 1;

    function handleSubmit(e) {
        e.preventDefault();
        if (type === "add") {
            handleCreateCommodity();
        } else if (type === "edit") {
            handleUpdateCommodity();
        }
    }

    async function handleCreateCommodity() {
        const keys = Object.keys(data);
        const newCommodity = {};
        for (let key of keys) {
            if (data[key] !== null && data[key] !== undefined) {
                newCommodity[key] = data[key];
            }
        }

        try {
            const { data } = await CommodityTasks.createCommodity(ajax, newCommodity);
            closeDrawer();
            message.success("商品创建成功!");
            flushFn(data);
            // 刷新商品列表，并修改当前选中分类及商品
        } catch (error) {
            console.log(error);
        }
    }


    async function handleUpdateCommodity() {

        let new_data = {};
        const keys = Object.keys(data);
        for (let key of keys) {
            if (data[key] !== selectCommodity[key]) {
                new_data[key] = data[key];
            }
        }

        if (Object.keys(new_data).length === 0) {
            return;
        }

        try {
            const { data } = await CommodityTasks.updateCommodity(ajax, selectCommodity.barcode, new_data);
            console.log(data);
            closeDrawer();
            message.success("商品信息修改成功!");
            updateFn(selectCommodity.id, data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form
            className={styled["commodity-drawer-form"]}
            onSubmit={handleSubmit}
        >
            {
                renderRow(common)
            }
            <Form.Item
                style={{
                    marginTop: 20
                }}
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!allowSubmit}
                >
                    保存
                    </Button>
            </Form.Item>
        </Form>
    );
}

export const BaseForm = Form.create()(_BaseForm);



export function CommodityForm({ status = false, type, hideFn, selectCommodity, categories, flushFn, updateFn }) {

    function closeDrawer() {
        hideFn();
    }

    const initState = (() => {

        if (type === "edit") {
            if (selectCommodity) {
                return {
                    type: "edit",
                    title: "修改商品信息",
                    ...selectCommodity
                }
            }
            return {};
        } else {
            return {
                type: "add",
                title: "新增商品",
                barcode: null,//
                category_name: categories || null,//
                name: null,//
                in_price: null,//
                sale_price: null,//
                pinyin: null,//
                supplier_name: null,//
                unit: null,//
                size: null,//
                is_delete: false,//
                vip_points: true//
            };
        }
    })();

    const { title } = initState;


    return (
        <Drawer
            visible={status}
            title={title}
            width={450}
            onClose={closeDrawer}
            destroyOnClose
        >
            <BaseForm
                selectCommodity={selectCommodity}
                type={type}
                closeDrawer={closeDrawer}
                initState={initState}
                categories={categories}
                flushFn={flushFn}
                updateFn={updateFn}
            />
        </Drawer>
    );
}