import React, { useState } from "react";
import { Form, Input, Button, Row, Icon, Typography, Checkbox, message as antdMessage } from "antd";
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useAjax } from "../AjaxProvider";
import style from "../../styles/login.scss";
import { ConnectConfig } from "./ConnectConfig";

const { Text } = Typography;

function _Login({ form }) {

    const http = useAjax();
    const location = useLocation();
    const { isLogin, login } = useAuth();

    if (isLogin) {
        return <Redirect to={location.state && location.state.from || "/home"} />
    }

    const { getFieldDecorator, getFieldsValue, getFieldsError, setFields } = form;
    const formItemLayout = {
        wrapperCol: {
            xs: { span: 18 },
            sm: { span: 18 },
        },
    };

    const [isLoading, setLoading] = useState(false);

    function hasError() {
        // 判断是否有错误
        const error = getFieldsError();
        let keys = Object.keys(error);
        for (let key of keys) {
            if (error[key]) return true;
        }
        return false;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const { username, password } = getFieldsValue();
        try {
            const { data, status } = await http.post("/api/login", {
                username,
                password
            });

            if (status === 200) {
                const { message, token, username, authority, isAdmin } = data;

                setLoading(false);
                login(token, {
                    username,
                    authority,
                    isAdmin
                });

                antdMessage.success(message);
            }
        } catch (err) {
            const { status, data } = err;
            const userValue = {
                value: username,
                errors: [
                    new Error("请输入正确的用户名!")
                ]
            };

            const passValue = {
                value: password,
                errors: [
                    new Error("请输入正确的密码!")
                ]
            };


            let obj = {};

            if (status && status === 401) {
                const { type } = data.value;
                if (type === "username") {
                    obj.username = userValue;
                }
                if (type === "password") {
                    obj.password = passValue;
                }
            } else {
                obj = {
                    username: userValue,
                    password: passValue
                }
            }

            setFields(obj);
            setLoading(false);

        }
    }


    return (
        <div className={style["login-bg"]}>
            <div className={style["login-wrapper"]}>
                <Row type="flex" justify="center">
                    <Text
                        className={style["login-title"]}
                    >小牧收银系统</Text>
                </Row>
                <Form {...formItemLayout} onSubmit={handleSubmit}
                >
                    <Form.Item
                        type="flex"
                        justify="center"
                        hasFeedback
                    >
                        {
                            getFieldDecorator(
                                "username",
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入用户名!"
                                        },
                                        {
                                            pattern: /^\S*$/g,
                                            message: "用户名中不能有空格!"
                                        }
                                    ]
                                }
                            )(
                                <Input
                                    type="text"
                                    placeholder="请输入账号"
                                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                                />

                            )
                        }
                    </Form.Item>
                    <Form.Item
                        type="flex"
                        justify="center"
                    >
                        {
                            getFieldDecorator(
                                "password",
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入密码!"
                                        },
                                        {
                                            pattern: /^\S*$/g,
                                            message: "密码中不能有空格!"
                                        }
                                    ]
                                }
                            )(
                                <Input
                                    type="password"
                                    placeholder="请输入密码"
                                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        type="flex"
                        justify="center"
                        className={style["login-input-fix"]}
                    >
                        <Checkbox>本机服务器模式</Checkbox>
                    </Form.Item>
                    <Form.Item
                        type="flex"
                        justify="center"
                    >
                        <Button
                            loading={isLoading}
                            style={{
                                width: "100%"
                            }}
                            disabled={hasError()}
                            type="primary" htmlType="submit">登录</Button>
                    </Form.Item>
                    <ConnectConfig />
                </Form>
            </div>
        </div>
    );
}


export const Login = Form.create()(_Login);