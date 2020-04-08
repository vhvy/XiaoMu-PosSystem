import React, { useState } from "react";
import { Icon, Dropdown, Menu, Avatar, Modal, message, Form, Input, message as antdMessage } from "antd";
import { Users } from "../../../tasks/Users";
import { useAuth } from "../../AuthProvider";
import { useAjax } from "../../AjaxProvider";


const { Item } = Menu;
const { confirm } = Modal;

function _ChangePwdForm({ form, new_pwd }) {

    const { value: new_pwd_value } = new_pwd;

    const PwdIcon = <Icon type="lock" />
    const { getFieldDecorator } = form;

    const item = [
        {
            field: "new_pwd",
            label: "新密码",
            placeholder: "请输入新密码"
        },
        {
            field: "re_new_pwd",
            label: "新密码",
            placeholder: "请再次输入新密码"
        }
    ];

    const formItemLayout = {
        labelCol: {
            xs: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 20 }
        },
    };

    const rules = [
        {
            required: true,
            message: "密码不能为空!"
        },
        {
            min: 3,
            max: 32,
            message: "请输入正确长度的密码!"
        },
        {
            pattern: /^\S*$/g,
            message: "密码中不能有空格!"
        }
    ];

    const customValid = {
        validator: (rule, value, callback) => {
            if (new_pwd_value === value) {
                callback();
            } else {
                callback("两次输入的密码不相同!");
            }
        }
    }


    return (
        <Form {...formItemLayout} >
            {
                item.map(({ field, label, placeholder }) => {
                    return (
                        <Form.Item label={label} key={field} colon={false}>
                            {
                                getFieldDecorator(
                                    field,
                                    {
                                        validateFirst: true,
                                        rules: field === "re_new_pwd" ? [...rules, customValid] : rules
                                    }
                                )(
                                    <Input type="password" prefix={PwdIcon} placeholder={placeholder} />
                                )
                            }
                        </Form.Item>
                    );
                })
            }
        </Form>);
}

const ChangePwdForm = Form.create({
    mapPropsToFields(props) {
        return {
            new_pwd: Form.createFormField({
                ...props.new_pwd,
                value: props.new_pwd.value
            }),
            re_new_pwd: Form.createFormField({
                ...props.re_new_pwd,
                value: props.re_new_pwd.value
            })
        }
    },
    onFieldsChange({ onChange }, fields) {
        onChange(fields);
    }

})(_ChangePwdForm);

function UserChangePwdModal({ show, setShow }) {

    const ajax = useAjax();
    const { username } = useAuth();

    const initValue = {
        new_pwd: {
            value: ""
        },
        re_new_pwd: {
            value: ""
        }
    };

    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(initValue);

    function handleFormChange(changeFields) {
        setFields(fields => ({
            ...fields,
            ...changeFields
        }));
    }

    function hideModal() {
        if (!loading) setShow(false);
        clearPwd();
    }

    function clearPwd() {
        setTimeout(() => setFields(initValue));
    }

    async function changePwd() {
        setLoading(true);
        const { status, message } = await Users.changePwd(ajax, {
            username,
            new_password: fields.re_new_pwd.value
        });
        if (status) {
            antdMessage.success(message);
            setLoading(false);
            hideModal();
            clearPwd();
        } else {
            antdMessage.error(message);
            setLoading(false);
        }
    }

    const okButtonDisable = (() => {
        const { new_pwd, re_new_pwd } = fields;
        if (new_pwd.value !== re_new_pwd.value) return true;

        const keys = Object.keys(fields);
        for (let key of keys) {
            const { errors, value } = fields[key];
            if (errors || value === "") return true;
        }
        return false;
    })();

    return (
        <Modal
            title="修改密码"
            visible={show}
            onCancel={hideModal}
            onOk={changePwd}
            confirmLoading={loading}
            okText="修改"
            okButtonProps={{
                disabled: okButtonDisable
            }}
            cancelButtonProps={{
                disabled: loading
            }}
            width={400}
        >
            <ChangePwdForm {...fields} onChange={handleFormChange} />
        </Modal>);
}


export function UserAvatar() {

    const { logout, username } = useAuth();

    const [modalShow, setModalShow] = useState(false);


    function _logout(fn) {
        fn();
        logout();
        message.success("注销成功！");
    }

    function handleLogout() {
        confirm({
            centered: true,
            title: "确定要注销登录吗?",
            onOk: _logout
        });
    }

    function handleChangePwd() {
        setModalShow(true);
    }

    const menu = (
        <Menu>
            <Item key="修改密码" onClick={handleChangePwd}>
                修改密码
            </Item>
            <Item key="注销" onClick={handleLogout}>
                注销
            </Item>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={menu} placement="bottomCenter">
                <Avatar style={{
                    backgroundColor: "#87d068"
                }} >{username ? username : ""}</Avatar>
            </Dropdown>
            <UserChangePwdModal show={modalShow} setShow={setModalShow} />
        </>
    );
}