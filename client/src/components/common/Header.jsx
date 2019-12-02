import React, { useState, useEffect } from "react";
import { Layout, Popover, Avatar, Button, Modal, Menu, Icon, Dropdown, Form, Input, Switch, message as antd_message } from "antd";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { UserAuth } from "../../tools/tokenManage";
import style from "../../styles/home.scss";
import { Users } from "../../Model/Users";
import { formatTime } from "../../tools/formatTime";

const { confirm } = Modal;

const { Header } = Layout;

function _ChangePwdModal({ modalStatus, hideModal, form, username }) {
    const { getFieldDecorator, getFieldsError, getFieldsValue } = form;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    async function handleChangePwd() {
        setConfirmLoading(true);
        const { oldPwd, newPwd } = getFieldsValue();
        const data = {
            username,
            oldPwd,
            newPwd
        };
        const { status, message } = await Users.changePwd(data);
        if (status) {
            antd_message.success(message);
            setConfirmLoading(false);
            hideModal();
        } else {
            antd_message.error(message);
            setConfirmLoading(false);
        }
    }

    function hasError() {
        // 判断是否有错误
        const error = getFieldsError();
        let keys = Object.keys(error);
        for (let key of keys) {
            if (error[key]) return true;
        }
        return false;
    }

    function resetState() {
        // 用户连续多次修改密码时，恢复初始state, 防止使用上次的state
        setConfirmLoading(false);
    }

    function toggleShowPwd(bool) {
        if (bool !== showPwd) {
            setShowPwd(bool);
        }
    }

    return (
        <Modal
            width="300px"
            title="修改密码"
            centered
            visible={modalStatus}
            closable={false}
            confirmLoading={confirmLoading}
            destroyOnClose={true}
            okText="修改"
            onOk={handleChangePwd}
            onCancel={hideModal}
            okButtonProps={{
                disabled: hasError()
            }}
        >
            <Form>
                <Form.Item
                    label="旧密码"
                    hasFeedback
                >

                    {
                        getFieldDecorator(
                            "oldPwd",
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: "旧密码为必填项!"
                                    },
                                    {
                                        pattern: /^\S*$/g,
                                        message: "密码中不能有空格!"
                                    }
                                ]
                            })(
                                <Input type={showPwd ? "text" : "password"} />
                            )
                    }
                </Form.Item>
                <Form.Item label="新密码">
                    {
                        getFieldDecorator("newPwd", {
                            rules: [
                                {
                                    required: true,
                                    message: "新密码为必填项!"
                                },
                                {
                                    pattern: /^\S*$/g,
                                    message: "密码中不能有空格!"
                                }
                            ]
                        })(
                            <Input type={showPwd ? "text" : "password"} />
                        )
                    }
                </Form.Item>
                <Form.Item label="请再次输入新密码">
                    {
                        getFieldDecorator("newPwdRepeat", {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请再次输入新密码!"
                                },
                                {
                                    pattern: /^\S*$/g,
                                    message: "密码中不能有空格!"
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        const { newPwd, newPwdRepeat } = getFieldsValue();
                                        if (newPwd !== newPwdRepeat) {
                                            callback("两次输入的密码不一致!");
                                        }
                                        callback();
                                    }
                                }
                            ]
                        })(
                            <Input type={showPwd ? "text" : "password"} />
                        )
                    }
                </Form.Item>
                <Form.Item
                    label="是否显示密码"
                >
                    <Switch
                        onChange={toggleShowPwd}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

function ChangePwdModal_MapStateToProps(state) {
    return {
        username: state.userDetails.username
    }
}


const ChangePwdModal = connect(ChangePwdModal_MapStateToProps)(Form.create()(_ChangePwdModal));

function _HeaderUserMenu({ username }) {

    const [modalStatus, setModalStatus] = useState(false);
    const history = useHistory();
    const funcList = [
        {
            key: "changePwd",
            text: "修改密码",
            fn: showModal
        },
        {
            key: "logout",
            text: "注销",
            fn: logout
        }
    ];

    const menu = (
        <Menu onClick={handleClick}>
            {
                funcList.map(({ key, text }) => <Menu.Item key={key}>{text}</Menu.Item>)
            }
        </Menu>
    );

    function showModal() {
        setModalStatus(true);
    }

    function hideModal() {
        setModalStatus(false);
    }

    function logout() {
        confirm({
            title: "注销",
            content: "确定要注销吗?",
            onOk() {
                UserAuth.logout();
                history.push("/login");
            }
        });
    }

    function handleClick({ key }) {
        const func = funcList.find(func => func.key === key);
        func && func.fn();
    }

    return (
        <>
            <Dropdown overlay={menu}>
                <span
                    className={style["header-menu-item"]}
                >
                    <Icon type="user" />
                    <span> {username} </span>
                </span>
            </Dropdown>
            <ChangePwdModal modalStatus={modalStatus} hideModal={hideModal} />
        </>
    );
}


function HeaderUserMenu_MapStateToProps(state) {
    return {
        username: state.userDetails.username
    }
}

const HeaderUserMenu = connect(HeaderUserMenu_MapStateToProps)(_HeaderUserMenu);

function HeaderCustom() {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(function () {
            setCurrentTime(new Date());
        }, 1000);
        return function () {
            clearInterval(timer);
        }
    }, []);

    return (
        <Header
            className={style["home-header"]}
        >
            <div className={style["header-logo"]}>小牧收银系统</div>
            <span>{formatTime(currentTime)}</span>
            <HeaderUserMenu />
        </Header>
    );
}

export {
    HeaderCustom
};

export default HeaderCustom;