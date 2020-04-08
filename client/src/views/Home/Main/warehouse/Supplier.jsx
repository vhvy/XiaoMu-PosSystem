import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAjax } from "../../../AjaxProvider";
import styled from "../../../../styles/warehouse/supplier.scss";
import { Modal, Button, Input, Form, message } from "antd";
import { SupplierTask } from "../../../../tasks/supplier";
import { VirtualSelectList } from "../../../../components/VirtualSelectList";
import config from "../../../../config";

const { DEFAULT_SUPPLIER_NAME } = config;

const { Search } = Input;
const { Item } = Form;

function SupplierSearch({ btnList, isDefault }) {

    const inputRef = useRef(null);

    const [value, setValue] = useState("");

    function handleInput({ target }) {
        setValue(target.value);
    }

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    function handleKeyDown(e) {
        // 处理快捷键
        const { key } = e;
        const item = btnList.find(b => b.key === key);
        item && (key === "Enter" ? item.fn(value) : item.fn());
    }

    return (
        <div className={styled["supplier-search"]}>
            <Search
                value={value}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={handleInput}
                placeholder="请在此输入需要查找的供应商信息"
            />
            {
                btnList.filter(({ show = true }) => show).map(({ title, key, fn, type, icon = "", defaultCheck = false }) => (
                    <Button
                        icon={icon}
                        type={type}
                        key={key}
                        onClick={fn}
                        disabled={defaultCheck ? isDefault : false}
                    >
                        {`${title} <${key}>`}
                    </Button>
                ))
            }
        </div>
    );
}

export function Supplier() {

    const ajax = useAjax();

    const [modalData, setModalData] = useState({
        status: false,
        type: "增加"
    });
    // Modal窗口的状态

    function hideModal() {
        setModalData(s => ({
            ...s,
            status: false
        }))
    }


    // const [supplierList, setSupplierList] = useState([]);
    // 供应商列表


    const initState = {
        select: 0,
        selectType: "origin",
        supplierList: []
    };


    const [selectData, setSelect] = useState(initState);

    const { select, selectType, supplierList } = selectData;

    function handleClickSelect(id) {
        setSelect(s => ({
            ...s,
            select: id,
            selectType: "click"
        }));
    }

    async function getSupplierList(first = false) {
        try {
            const { data } = await SupplierTask.getSupplier(ajax);
            if (first) {
                setSelect({
                    supplierList: data,
                    select: data[0].id,
                    selectType: "origin"
                });
            } else {
                setSelect(s => ({
                    ...s,
                    supplierList: data
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function init() {
            await getSupplierList(true);
        }
        init();
    }, []);

    const supplier = supplierList.find(i => i.id === select);
    const isDefaultSupplierFlag = supplier === undefined ? false : supplier.name === DEFAULT_SUPPLIER_NAME;

    function handleAdd() {
        // 增加供应商

        setModalData({
            status: true,
            type: "增加"
        });
    }

    function handleEdit() {
        // 修改供应商信息


        if (isDefaultSupplierFlag) return;

        setModalData({
            status: true,
            type: "修改"
        })
    }

    function deleteSupplier() {
        // 删除供应商

        if (isDefaultSupplierFlag) return;

        async function del(close) {
            try {
                await SupplierTask.deleteSupplier(ajax, supplier.name);
                close();
                message.success("删除成功!");
                getSupplierList(true);
            } catch (error) {
                console.log(error);
            }
        }

        Modal.confirm({
            autoFocusButton: "cancel",
            title: `确定要删除供应商${supplier.name}吗?`,
            okText: "删除",
            okType: "danger",
            onOk: del
        })

    }

    function selectUp() {
        // 上方向键修改当前选中供应商
        const index = supplierList.findIndex(s => s.id === select);
        if (supplierList < 2 || index === 0) return;

        setSelect(s => ({
            ...s,
            select: supplierList[index - 1].id,
            selectType: "up"
        }));
    }

    function selectDown() {
        // 下方向键修改当前选中供应商
        const index = supplierList.findIndex(s => s.id === select);
        if (supplierList < 2 || index === supplierList.length - 1) return;

        setSelect(s => ({
            ...s,
            select: supplierList[index + 1].id,
            selectType: "down"
        }));
    }

    function findSupplier(value) {

        function run(id) {
            setSelect(s => ({
                ...s,
                select: id,
                selectType: "origin"
            }));
        }

        const query = value.trim();
        if (query === "") return;
        for (let { name, phone, description, id } of supplierList) {
            if (name.includes(query) || phone && phone.includes(query) || description && description.includes(query)) {
                run(id);
                break;
            }
        }
    }

    const btnList = [
        {
            title: "增加",
            key: "F1",
            fn: handleAdd,
            icon: "form"
        },
        {
            title: "修改",
            key: "F2",
            fn: handleEdit,
            type: "primary",
            icon: "edit",
            defaultCheck: true
        },
        {
            title: "删除",
            key: "F3",
            fn: deleteSupplier,
            type: "danger",
            icon: "delete",
            defaultCheck: true
        },
        {
            key: "ArrowUp",
            fn: selectUp,
            show: false
        },
        {
            key: "ArrowDown",
            fn: selectDown,
            show: false
        },
        {
            key: "Enter",
            fn: findSupplier,
            show: false
        }
    ];


    return (
        <div className={styled["supplier-wrap"]}>
            <SupplierSearch btnList={btnList} isDefault={isDefaultSupplierFlag} />
            <SupplierList
                list={supplierList}
                select={select}
                selectType={selectType}
                handleClick={handleClickSelect}
            />
            <SupplierModal
                flushList={getSupplierList}
                status={modalData.status}
                type={modalData.type}
                hideFn={hideModal}
                supplier={supplier}
            />
        </div>
    );
}


const SupplierListColumns = [
    {
        title: "序号",
        key: "index",
        type: 1
    },
    {
        title: "供应商名称",
        key: "name",
        type: 2
    },
    {
        title: "联系方式",
        key: "phone",
        type: 2
    },
    {
        title: "备注",
        key: "description",
        type: 4
    }
];

const SupplierListFooterColumns = (length) => ([
    {
        title: "共计",
        type: 1,
        value: length || 0
    },
    {
        title: "SPACE",
        type: 2,
        value: ""
    }
]);

function SupplierList({ list, select, selectType, handleClick }) {

    const footerData = useMemo(() => SupplierListFooterColumns(list.length), [list.length]);

    return (
        <VirtualSelectList
            wrapCss={styled["supplier-list"]}
            data={list}
            select={select}
            selectType={selectType}
            columns={SupplierListColumns}
            footerColumn={footerData}
            handleClickSelect={handleClick}
        />
    );
}


const SupplierModal = Form.create({
    name: "supplier"
})(_SupplierModal);



function _SupplierModal({ hideFn, status = false, type = "增加", form, flushList, supplier }) {

    const { getFieldDecorator, isFieldsTouched, isFieldTouched, getFieldsValue, getFieldsError } = form;

    const ajax = useAjax();

    const inputRef = useRef();

    useEffect(() => {
        status && setTimeout(() => {
            inputRef.current.focus();
        });
    }, [status]);

    async function addSupplier() {
        const { name, phone, comment } = getFieldsValue();
        try {
            await SupplierTask.createSupplier(ajax, name, phone, comment);
            await flushList();
            hideFn();
            message.success(`供应商${name}创建完成!`);
        } catch (err) {
            console.log(err);
        }
    }

    async function editSupplier() {
        const { name: new_name, phone: new_phone, comment: new_description } = getFieldsValue();
        const { name, phone, description } = supplier;
        let data = {};
        if (name !== new_name) {
            data = {
                ...data,
                new_name
            };
        }
        if (phone !== new_phone && new_phone !== "") {
            data = {
                ...data,
                new_phone
            }
        }
        if (new_description !== description && new_description !== "") {
            data = {
                ...data,
                new_description
            }
        }

        try {
            await SupplierTask.updateSupplier(ajax, name, data);
            await flushList();
            hideFn();
            message.success(`供应商${name}修改完成!`);
        } catch (error) {
            console.log(error);
        }

    }

    const fields = {
        增加: {
            title: "增加供应商",
            okBtnText: "增加"
        },
        修改: {
            title: "修改供应商信息",
            okBtnText: "保存"
        }
    };

    const { title, okBtnText } = fields[type];

    const formItemLayout = {
        labelCol: {
            xs: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 18 }
        },
    };



    const isAddFlag = type === "增加";
    // 是否是新增供应商的flag

    const hasError = (() => {

        if (isAddFlag) {
            if (!isFieldTouched("name")) return true;
            // 如果名称字段没有输入过直接返回有错误

            const result = getFieldsError();
            const keys = Object.keys(result);
            for (let key of keys) {
                if (result[key]) return true;
            }
            return false;
        } else {
            return !isFieldsTouched();
        }
    })();

    const formConfig = [
        {
            label: "供应商名称",
            field: "name",
            placeholder: "请在此输入供应商名称",
            config: {
                initialValue: isAddFlag ? "" : supplier && (supplier.name || ""),
                rules: [
                    {
                        required: true,
                        message: "供应商名称不能为空！"
                    },
                    {
                        min: 1,
                        max: 10,
                        message: "供应商名称长度必须保持在1-10个字之间!"
                    }
                ]
            }
        },
        {
            label: "联系方式",
            field: "phone",
            placeholder: "请在此输入供应商联系方式",
            config: {
                initialValue: isAddFlag ? "" : supplier.phone || "",
                rules: [
                    {
                        min: 5,
                        max: 11,
                        message: "供应商联系方式长度必须保持在5-11个字之间!"
                    }
                ]
            }
        },
        {
            label: "备注",
            field: "comment",
            placeholder: "请在此输入备注",
            config: {
                initialValue: isAddFlag ? "" : supplier.description || "",
                rules: [
                    {
                        min: 1,
                        max: 100,
                        message: "供应商备注长度必须保持在1-100个字之间！"
                    }
                ]
            }
        }
    ];

    return (
        <Modal
            destroyOnClose={true}
            visible={status}
            okText={okBtnText}
            title={title}
            okButtonProps={{
                disabled: hasError
            }}
            onOk={isAddFlag ? addSupplier : editSupplier}
            onCancel={hideFn}
        >
            <Form
                {
                ...formItemLayout
                }
            >
                {
                    formConfig.map(
                        ({ label, field, placeholder, config }) => (
                            <Item label={label} key={field}>
                                {
                                    getFieldDecorator(field, config)(
                                        field === "name" ? <Input placeholder={placeholder} ref={inputRef} /> : <Input placeholder={placeholder} />
                                    )
                                }
                            </Item>
                        )
                    )
                }
            </Form>
        </Modal>
    );
}