import React, { useState } from "react";
import styled from "../../../../styles/users.scss";
import { Button, Modal, message, Form, Input, Select } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

const selector = ({ userDetails }) => ({
    login_user: userDetails.username
});

function _ChangeModal({
    type,
    status,
    form,
    closeModal,
    groups,
    user,
    createUser,
    changeUsername,
    changeUserPwd,
    changeUserGroup
}) {

    // console.log(user);

    function CustomGroupSelect(disabled) {
        const list = groups.map(({ usergroup }) => usergroup);
        return (
            <Select disabled={disabled}>
                {
                    list.map(i => (
                        <Option value={i} key={i}>{i}</Option>
                    ))
                }
            </Select>

        );
    }



    const {
        getFieldDecorator,
        getFieldsError,
        getFieldsValue,
        getFieldValue,
        isFieldsTouched,
        isFieldTouched
    } = form;

    const config = [
        {
            type: "add",
            title: "新建用户",
            okText: "新建",
            initialValue: {},
            onOk: handleCreateUser
        },
        {
            type: "name",
            title: "修改用户名称",
            okText: "修改",
            initialValue: {
                "name": user && user.username || null,
                "new_name": null
            },
            onOk: handleChangeUsername
        },
        {
            type: "pwd",
            title: "修改用户密码",
            okText: "修改",
            initialValue: {
                "name": user && user.username || null,
                "new_pwd": null
            },
            onOk: handleChangePwd
        },
        {
            type: "group",
            title: "修改用户组",
            okText: "修改",
            initialValue: {
                "name": user && user.username || null,
                "group": user && user.group || null,
                "new_group": null
            },
            onOk: handleChangeGroup
        }
    ];

    const { title, okText, initialValue, onOk } = config.find(i => i.type === type);

    const base_fields = [
        {
            id: "name",
            label: "用户名",
            showType: [
                "add",
                "name",
                "pwd",
                "group"
            ],
            disabled: {
                "add": false,
                "name": true,
                "pwd": true,
                "group": true
            },
            rules: [
                {
                    min: 1,
                    max: 13,
                    message: "用户名长度应保持在1-13个字之间!"
                }
            ]
        },
        {
            id: "pwd",
            label: "密码",
            type: "password",
            showType: [
                "add"
            ],
            disabled: {
                "add": false
            },
            rules: [
                {
                    pattern: /^[a-zA-Z0-9]{5,30}$/,
                    message: "密码应为在5-30个数字或英文字母!"
                }
            ]
        },
        {
            id: "group",
            label: "所属分组",
            showType: [
                "add",
                "group"
            ],
            ComponentFn: CustomGroupSelect,
            disabled: {
                "add": false,
                "group": true
            }
        },
        {
            id: "new_name",
            label: "新用户名",
            showType: [
                "name"
            ],
            disabled: {
                "name": false
            },
            rules: [
                {
                    min: 1,
                    max: 13,
                    message: "用户名长度应保持在1-13个字之间!"
                }
            ]
        },
        {
            id: "new_pwd",
            label: "新密码",
            type: "password",
            showType: [
                "pwd"
            ],
            disabled: {
                "pwd": false
            },
            rules: [
                {
                    pattern: /^[a-zA-Z0-9]{5,30}$/,
                    message: "密码应为在5-30个数字或英文字母!"
                }
            ]
        },
        {
            id: "new_group",
            label: "新用户组",
            showType: [
                "group"
            ],
            ComponentFn: CustomGroupSelect,
            disabled: {
                "group": false
            }
        }
    ];

    const fields = base_fields.filter(({ showType }) => showType.includes(type));

    const formLayout = {
        wrapperCol: {
            span: 16
        },
        labelCol: {
            span: 6
        }
    }

    const idList = fields.filter(({ disabled }) => !disabled[type]).map(({ id }) => id);

    const hasError = (() => {
        if (!isFieldsTouched()) return true;

        for (let id of idList) {
            if (!isFieldTouched(id)) return true;
        }

        const errors = getFieldsError();
        const keys = Object.keys(errors);

        for (let key of keys) {
            if (errors[key]) return true;
        }

        return false;
    })();

    function handleCreateUser() {
        const data = getFieldsValue();
        const { name, pwd, group } = data;
        createUser(name, pwd, group, closeModal);
    }

    function handleChangeUsername() {
        const data = getFieldsValue();
        const { name, new_name } = data;
        if (name === new_name) {
            return message.warn("新用户名和当前用户名不能相同!");
        }
        changeUsername(name, new_name, closeModal);
    }

    function handleChangePwd() {
        const data = getFieldsValue();
        const { name, new_pwd } = data;
        changeUserPwd(name, new_pwd, closeModal);
    }

    function handleChangeGroup() {
        const data = getFieldsValue();
        const { name, new_group, group } = data;

        if (group === new_group) {
            return message.warn("新用户组和当前用户组不能相同!");
        }

        changeUserGroup(name, new_group, closeModal);
    }

    return (
        <Modal
            visible={status}
            onCancel={closeModal}
            title={title}
            okText={okText}
            onOk={onOk}
            width={400}
            okButtonProps={{
                disabled: hasError
            }}
            destroyOnClose
        >
            <Form
                {...formLayout}
            >
                {
                    fields.map(({
                        id,
                        label,
                        rules = [],
                        ComponentFn,
                        disabled,
                        type: _type = "text"
                    }) => (
                            <Form.Item label={label} key={label}>
                                {
                                    getFieldDecorator(id, {
                                        initialValue: initialValue[id],
                                        rules: [
                                            {
                                                required: !disabled[type],
                                                message: `${label}为必填项!`
                                            },
                                            ...rules
                                        ]
                                    })(
                                        ComponentFn ? ComponentFn(disabled[type]) : <Input
                                            type={_type}
                                            disabled={disabled[type]}
                                        />
                                    )
                                }
                            </Form.Item>
                        ))
                }
            </Form>
        </Modal>
    );
}

const ChangeModal = Form.create()(_ChangeModal);

export function UserManageFn({
    groups,
    user,
    ajax,
    createUser,
    changeUsername,
    changeUserPwd,
    changeUserGroup,
    changeUserStatus
}) {

    const [modalData, setModalData] = useState({
        status: false,
        type: "add"
    });

    function closeModal() {
        setModalData(s => ({
            ...s,
            status: false
        }));
    }

    const { login_user } = useSelector(selector);

    function handleStatus() {
        const { username, disabled } = user;
        const text = disabled ? "启用" : "禁用";

        Modal.confirm({
            title: `确认要${text}用户${username}吗?`,
            okText: text,
            onOk: (cb) => {
                changeUserStatus(username, !disabled, () => {
                    message.success(`${text}成功!`);
                    cb();
                });
            }
        });
    }

    const disabled = !user;

    const status = user && user.disabled;

    function setType(type = "add") {
        setModalData(s => ({
            ...s,
            status: true,
            type
        }));
    }

    const config = [
        {
            title: "新建用户",
            icon: "user-add",
            fn: setType.bind(null, "add")
        },
        {
            title: "修改用户名称",
            icon: "edit",
            disabled: disabled,
            fn: setType.bind(null, "name")
        },
        {
            title: "修改用户密码",
            icon: "edit",
            disabled: disabled,
            fn: setType.bind(null, "pwd")
        },
        {
            title: "修改用户组",
            icon: "edit",
            disabled: disabled || login_user === user.username,
            fn: setType.bind(null, "group")
        },
        {
            title: `${status ? "启用" : "禁用"}用户`,
            btnType: status ? "primary" : "danger",
            icon: status ? "eye" : "eye-invisible",
            disabled: disabled || login_user === user.username,
            fn: handleStatus
        }
    ];

    return (
        <div className={styled["user-manage-fn"]}>
            {
                config.map(({
                    title,
                    btnType = "primary",
                    icon,
                    disabled = false,
                    fn
                }) => (
                        <Button
                            type={btnType}
                            key={title}
                            icon={icon}
                            disabled={disabled}
                            onClick={fn}
                        >
                            {title}
                        </Button>
                    ))
            }
            <ChangeModal
                {...modalData}
                closeModal={closeModal}
                groups={groups}
                user={user}
                createUser={createUser}
                changeUsername={changeUsername}
                changeUserPwd={changeUserPwd}
                changeUserGroup={changeUserGroup}
            />
        </div>
    );
}