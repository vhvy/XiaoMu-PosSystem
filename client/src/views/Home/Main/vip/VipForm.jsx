import React, { useEffect, useState } from "react";
import { Drawer, Form, Radio, Input, Button, Switch, message } from "antd";
import styled from "../../../../styles/vip.scss";
import { CustomSelectTree } from "../../../../components/CustomSelectTree";
import { VipManage } from "../../../../tasks/vip";
import { useAjax } from "../../../AjaxProvider";

function VipTypeSelectTree({ handleChange, value }) {

    const [vipTypeList, setVipTypeList] = useState([]);

    async function getVipTypeList() {
        // 目前只有积分卡

        const list = [{
            id: 1,
            name: "积分卡"
        }];

        setVipTypeList(list);
        handleChange(list[0].name);
    }

    useEffect(() => {
        getVipTypeList();
    }, []);

    return (
        <CustomSelectTree
            value={value}
            onChange={handleChange}
            tree={vipTypeList}
        />
    )
}

function _VipForm({
    status,
    closeDrawer,
    form,
    addVip,
    updateVip,
    selectItem,
    type
}) {

    const ajax = useAjax();

    const {
        getFieldDecorator,
        getFieldsError,
        getFieldsValue,
        isFieldsTouched,
        isFieldTouched
    } = form;

    function handleClose() {
        closeDrawer();
    }


    const initValue = [
        {
            type: "add",
            title: "新增会员",
            okText: "新增",
            name: null,
            vip_type: null,
            sex: "男",
            is_disable: false,
            phone: null,
            submitFn: handleCreateVip
        },
        {
            type: "edit",
            title: "修改会员信息",
            okText: "修改",
            name: selectItem && selectItem.name || null,
            vip_type: selectItem && selectItem.vip_type || null,
            sex: selectItem && selectItem.sex || null,
            is_disable: selectItem && selectItem.is_disable || false,
            phone: selectItem && selectItem.phone || null,
            submitFn: handleUpdateVip
        }
    ];

    const { title, okText, submitFn, ...args } = initValue.find(i => i.type === type);

    const [vipType, setVipType] = useState(args.vip_type);
    const [vipSex, setVipSex] = useState(args.sex);
    const [is_disable, setDisable] = useState(args.is_disable);

    useEffect(() => {
        if (status && type === "edit") {
            vipSex !== args.sex && setVipSex(args.sex);
            is_disable !== args.is_disable && setDisable(args.is_disable);
        }
    }, [status]);

    function handleDisVip(e) {
        setDisable(e);
    }

    function handleSexChange({ target }) {
        setVipSex(target.value);
    }

    function handleVipType(e) {
        setVipType(e);
    }

    const VipDisable = (
        <Switch
            checked={is_disable}
            onChange={handleDisVip}
        />
    );

    const VipTypeSelect = (
        <VipTypeSelectTree
            value={vipType}
            handleChange={handleVipType}
        />
    );
    const VipSexSelect = (
        <Radio.Group
            onChange={handleSexChange}
            value={vipSex}
        >
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
        </Radio.Group>
    );

    const baseConfig = [
        {
            label: "会员卡号",
            id: "code",
            rules: [
                {
                    required: true,
                    message: "会员卡号不能为空!"
                },
                {
                    pattern: /^\d{4,10}$/,
                    message: "会员卡号应为4-10个数字!"
                }
            ],
            edit: false
        },
        {
            label: "会员卡类型",
            component: VipTypeSelect,
            edit: false,
        },
        {
            label: "持卡人姓名",
            id: "name",
            rules: [
                {
                    required: true,
                    message: "会员姓名不能为空!"
                },
                {
                    min: 1,
                    max: 10,
                    message: "会员姓名应为1-10个字符！"
                }
            ],
            initValue: args.name
        },
        {
            label: "性别",
            component: VipSexSelect
        },
        {
            label: "手机号",
            id: "phone",
            rules: [
                {
                    min: 5,
                    max: 13,
                    message: "手机号应为5-13个字符!"
                }
            ],
            initValue: args.phone
        },
        {
            label: "是否禁用",
            component: VipDisable,
            initValue: args.is_disable
        }
    ];

    const config = type === "add" ? baseConfig : baseConfig.filter(({ edit = true }) => edit);

    const formLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 7
        }
    }


    async function handleUpdateVip(e) {
        e.preventDefault();

        const values = Object.assign({}, getFieldsValue(), {
            is_disable,
            sex: vipSex
        });

        console.log(selectItem);

        const keys = Object.keys(values);

        const needUpdateValues = {};

        let changeFlag = false;

        for (let key of keys) {
            if (selectItem[key] !== values[key]) {
                needUpdateValues[key] = values[key];

                !changeFlag && (changeFlag = true);
            }
        }

        if (!changeFlag) {
            return message.info("没有需要修改的信息！");
        }

        try {
            const { data } = await VipManage.updateVipMember(ajax, selectItem.code, needUpdateValues);

            const { code, ...args } = data;

            updateVip(code, args);

            message.success("修改成功!");

            closeDrawer();
        } catch (error) {
            console.log(error);
        }
    }

    async function handleCreateVip(e) {
        e.preventDefault();

        const value = Object.assign({}, getFieldsValue(), {
            is_disable,
            sex: vipSex

        });

        if (vipType && vipType.trim() !== "") {
            value["vip_type"] = vipType;
        }

        try {
            const { data } = await VipManage.createVipMember(ajax, value);
            console.log(data);
            addVip(data);
            handleClose();
            message.success("会员卡创建完成!");
        } catch (error) {
            console.log(error);
        }
    }

    const cantSubmit = (() => {

        const errors = getFieldsError();
        const errKeys = Object.keys(errors);
        for (let key of errKeys) {
            if (errors[key]) return false;
        }

        if (type === "add") {
            if (!isFieldsTouched() || !isFieldTouched("code") || !isFieldTouched("name")) return false;

            if (!vipType || vipType && vipType.trim() === "") return false;
        }

        return true;
    })();

    return (
        <Drawer
            visible={status}
            // destroyOnClose
            width={400}
            onClose={handleClose}
            className={styled["vip-drawer"]}
            title={title}
        >
            <Form
                {...formLayout}
                onSubmit={submitFn}
            >
                {
                    config.map(({
                        label,
                        component,
                        id,
                        initValue,
                        rules = []
                    }) => (
                            <Form.Item
                                key={label}
                                label={label}
                            >
                                {
                                    component ? component : getFieldDecorator(id, {
                                        rules,
                                        initialValue: initValue
                                    })(<Input />)
                                }
                            </Form.Item>
                        ))
                }
                <Button
                    block
                    htmlType="submit"
                    type="primary"
                    disabled={!cantSubmit}
                >{okText}</Button>
            </Form>
        </Drawer>
    );
}

export const VipForm = Form.create()(_VipForm);