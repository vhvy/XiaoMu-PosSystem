import React, { useState, useEffect, useMemo } from "react";
import styled from "../../../../styles/users.scss";
import { UserManageFn } from "./UserManageFn";
import { UserManageList } from "./UserManageList";
import { useAjax } from "../../../AjaxProvider";
import { Users } from "../../../../tasks/Users";
import { GroupManage } from "../../../../tasks/groups";
import { message } from "antd";

export function UserManage() {

    const ajax = useAjax();

    const [usersData, setUsersData] = useState({
        users: [],
        selectId: -1,
        selectType: "origin"
    });

    const [groups, setGroups] = useState([]);

    async function getAllUser() {
        try {
            const { data } = await Users.getAllUser(ajax);
            setUsersData(s => ({
                ...s,
                users: data,
                selectId: data[0].id
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async function createUser(username, password, group, cb) {
        try {
            const { data } = await Users.createUser(ajax, username, password, group);

            message.success("用户创建成功!");
            cb && cb();
            setUsersData(s => ({
                ...s,
                users: [...s.users, data],
                selectId: data.id,
                selectType: "origin"
            }));

        } catch (error) {
            console.log(error);
        }
    }

    async function changeUsername(username, new_username, cb) {
        try {
            const { data } = await Users.changeUsername(ajax, username, new_username);

            cb && cb();
            message.success("用户名修改成功!");

            setUsersData(s => ({
                ...s,
                users: s.users.map(i => {
                    if (i.username === username) {
                        return {
                            ...i,
                            username: new_username
                        };
                    }
                    return i;
                })
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async function changeUserPwd(user, pwd, cb) {
        try {
            await Users.changeUserPwd(ajax, user, pwd);

            cb && cb();
            message.success("密码修改成功!");
        } catch (error) {
            console.log(error);
        }
    }

    async function changeUserGroup(user, group, cb) {
        try {
            const { data } = await Users.changeUserGroup(ajax, user, group);

            cb && cb();
            message.success("用户组修改完成!");

            setUsersData(s => ({
                ...s,
                users: s.users.map(i => {
                    if (i.username === user) {
                        return {
                            ...i,
                            group
                        };
                    }
                    return i;
                })
            }));

        } catch (error) {
            console.log(error);
        }
    }

    async function changeUserStatus(user, status, fn) {
        try {
            await Users.changeUserStatus(ajax, user, status);

            setUsersData(s => ({
                ...s,
                users: s.users.map(i => {
                    if (i.username === user) {
                        return {
                            ...i,
                            disabled: status ? 1 : 0
                        };
                    }
                    return i;
                })
            }));
            fn();
        } catch (error) {
            console.log(error);
        }
    }


    async function getAllGroup() {
        try {
            const { data } = await GroupManage.getAllGroup(ajax);
            setGroups(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllUser();
        getAllGroup();
    }, []);

    function handleClickSelect(selectId) {
        setUsersData(s => ({
            ...s,
            selectId
        }));
    }

    const { users, selectId, selectType } = usersData;

    const list = useMemo(() => users.map(({ disabled, ...args }) => ({
        ...args,
        disabled: disabled ? "禁用" : "启用"
    })), [users]);

    return (
        <div className={styled["user-manage-wrap"]}>
            <UserManageList
                {...usersData}
                list={list}
                selectId={selectId}
                selectType={selectType}
                handleClickSelect={handleClickSelect}
            />
            <UserManageFn
                ajax={ajax}
                groups={groups}
                user={users.find(i => i.id === selectId)}
                createUser={createUser}
                changeUsername={changeUsername}
                changeUserPwd={changeUserPwd}
                changeUserGroup={changeUserGroup}
                changeUserStatus={changeUserStatus}
            />
        </div>
    );
}