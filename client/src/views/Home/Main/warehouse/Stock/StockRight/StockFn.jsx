import React, { useState } from "react";
import styled from "../../../../../../styles/warehouse/stock.scss";
import { Button, Form, Input, Modal, InputNumber, message } from "antd";
import { useAjax } from "../../../../../AjaxProvider";
import { SupplierSelect } from "../../../../../../components/SupplierSelect";
import { useSelector, useDispatch } from "react-redux";
import {
    addWareStockAction,
    cleanWareStockAction,
    initWareStockAction,
    removeWareStockAction
} from "../../../../../../redux/action";
import { CommodityTasks } from "../../../../../../tasks/commodity";
import { StockTasks } from "../../../../../../tasks/stock";

function Add({ toggleToAdd }) {

    const config = [
        {
            label: "新增",
            fn: toggleToAdd
        }
    ];

    return (config.map(({ label, fn, type = "primary" }) => (
        <Button key={label} type={type} onClick={fn}>{label}</Button>
    )));
}


function _AddCommodityModal({ status, handleAdd, closeModal, form, ajax }) {

    const { getFieldsValue, getFieldDecorator, getFieldsError } = form;

    const formLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 8
        }
    };

    const config = [
        {
            label: "商品条码",
            placeholder: "请在此输入商品条码",
            name: "barcode"
        },
        {
            label: "商品进价",
            name: "in_price",
            type: "number"
        },
        {
            label: "商品数量",
            name: "count",
            type: "number"
        }
    ];

    async function handleOk() {
        const { barcode, count, in_price } = getFieldsValue();

        try {
            const { data } = await CommodityTasks.query(ajax, barcode);
            if (data.length !== 1) {
                message.error("没有找到相关商品!");
            } else {
                handleAdd({
                    barcode,
                    name: data[0].name,
                    count,
                    in_price
                });
                closeModal();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const hasError = (() => {
        const error = getFieldsError();
        const errorKeys = Object.keys(error);

        for (let key of errorKeys) {
            if (error[key]) return true;
        }

        const data = getFieldsValue();
        const keys = Object.keys(data);
        for (let key of keys) {
            if (!data[key] || data[key] === "") return true;
        }

        return false;
    })();

    return (
        <Modal
            visible={status}
            destroyOnClose
            okText="添加"
            onOk={handleOk}
            onCancel={closeModal}
            title="添加商品"
            width={300}
            okButtonProps={{
                disabled: hasError
            }}
        >
            <Form
                {...formLayout}
            >
                {
                    config.map(({ label, name, type, placeholder = "" }) => (
                        <Form.Item label={label} key={name}>
                            {getFieldDecorator(name, {
                                rules: [
                                    {
                                        required: true,
                                        message: "此项为必填项!"
                                    }
                                ]
                            })(
                                type === "number" ? (
                                    <InputNumber
                                        min={0}
                                        max={99999}
                                    />
                                ) : <Input placeholder={placeholder} />
                            )}
                        </Form.Item>
                    ))
                }
            </Form>
        </Modal>
    );
}

const AddCommodityModal = Form.create()(_AddCommodityModal);

const selector = ({ warehouse }) => ({
    list: warehouse.stock.list,
    selectId: warehouse.stock.selectId
});

function _AddForm({ toggleToDetails, form, addStock }) {
    const [modalStatus, setModalStatus] = useState(false);

    const { getFieldDecorator, getFieldsValue } = form;
    const [supplier, setSupplier] = useState(null);

    const { list, selectId } = useSelector(selector);
    const dispatch = useDispatch();
    const ajax = useAjax();

    const Supplier = (
        <SupplierSelect
            ajax={ajax}
            value={supplier}
            handleChange={setSupplier}
        />
    );

    const formLayout = {
        wrapperCol: {
            span: 20
        },
        labelCol: {
            span: 3
        }
    };

    function handleAdd() {
        setModalStatus(true);
    }

    function closeModal() {
        setModalStatus(false);
    }

    function handleCancel() {
        toggleToDetails();
    }

    function handleDel() {
        dispatch(removeWareStockAction());
    }

    async function submitStockOrder() {
        const { description } = getFieldsValue();

        const value = {
            supplier_name: supplier,
            commodity_list: list.map(({ barcode, count, in_price }) => ({ barcode, count, in_price }))
        };

        if (description && description !== "") {
            value.description = description;
        }

        try {
            const { data } = await StockTasks.createStockOrder(ajax, value);
            addStock(data);
            toggleToDetails();
        } catch (error) {
            console.log(error);
        }
    }

    const config = [
        {
            id: "supplier",
            label: "供应商",
            component: Supplier,
            value: supplier,
        },
        {
            id: "description",
            label: "备注",
        },
        {
            id: "addBtn",
            label: "添加商品",
            type: "btn",
            btnType: "primary",
            fn: handleAdd
        },
        {
            id: "delBtn",
            label: "删除商品",
            type: "btn",
            btnType: "danger",
            fn: handleDel,
            disabled: list.length === 0 && selectId === -1
        },
        {
            id: "submit",
            label: "提交进货单",
            type: "btn",
            btnType: "primary",
            fn: submitStockOrder,
            disabled: list.length === 0
        },
        {
            id: "cancel",
            label: "取消",
            type: "btn",
            btnType: "",
            fn: handleCancel
        }
    ];

    function handleAddCommodity(data) {
        dispatch(addWareStockAction(data));
    }

    return (
        <>
            <Form
                {...formLayout}
            >
                {
                    config.map(
                        ({ id, component, type, label, value, btnType, fn, disabled = false }) => (
                            type === "btn" ?
                                (<Button
                                    onClick={fn}
                                    type={btnType}
                                    key={id}
                                    disabled={disabled}
                                >
                                    {label}
                                </Button>
                                )
                                :
                                (<Form.Item label={label} key={id} >
                                    {
                                        component ? component : getFieldDecorator(id, {
                                            initialValue: value
                                        })(<Input />)
                                    }
                                </Form.Item>)
                        )
                    )
                }
            </Form>
            <AddCommodityModal
                status={modalStatus}
                handleAdd={handleAddCommodity}
                closeModal={closeModal}
                ajax={ajax}
            />
        </>
    );
}

const AddForm = Form.create()(_AddForm);


export function StockFn({ type, toggleType, addStock }) {

    function toggleToAdd() {
        toggleType("add");
    }

    function toggleToDetails() {
        toggleType("details");
    }

    const Component = type === "details" ? (
        <Add toggleToAdd={toggleToAdd} />
    ) : (
            <AddForm
                toggleToDetails={toggleToDetails}
                addStock={addStock}
            />
        );

    return (
        <div className={styled["stock-fn"]}>{Component}</div>
    );
}