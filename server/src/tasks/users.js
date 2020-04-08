import AppDAO from "../data/AppDAO.js";
import { validateData } from "../lib/encryptPwd.js";
import AuthorityTask from "./authority.js";
import GroupTask from "./groups.js";

class UsersTask {

    static async getAllUser() {
        const all_user_list = await AppDAO.all(`
        SELECT id, username, group_id, disabled FROM users
        ;`);
        return await this.mapValueToText(all_user_list);
    }

    static async mapValueToText(list) {
        return await Promise.all(list
            .map(async ({ group_id, id, username, disabled }) => {
                const { usergroup } = await GroupTask.getGroupDetails(group_id);
                return {
                    id,
                    username,
                    disabled: disabled === 1,
                    group_id,
                    group: usergroup
                }
            }));
    }

    static async createUser(
        username,
        hash,
        group_id
    ) {
        return await AppDAO.run(`
        INSERT INTO users 
        (username, password, group_id)
        VALUES (?, ?, ?)
        ;`, [
            username,
            hash,
            group_id
        ]);
    }

    static async changeUserGroup(user, new_group) {
        const user_query = (typeof user === "number") ? "id" : "username";
        const { id } = await GroupTask.getGroupDetails(new_group);
        return AppDAO.run(`
        UPDATE users SET group_id=? WHERE ${user_query}=?
        ;`, [
            id,
            user
        ]);
    }

    static async changeUserPwd(queryUser, newPwd) {
        if (typeof queryUser === "number") {
            return await AppDAO.run(`
        UPDATE users SET password=? WHERE id=?
        ;`, [
                newPwd,
                queryUser
            ]);
        } else {
            return await AppDAO.run(`
        UPDATE users SET password=? WHERE username=?
        ;`, [
                newPwd,
                queryUser
            ]);
        }
    }

    static async changeUserName(query, newUsername) {
        // query是老用户名
        if (typeof query === "number") {
            return await AppDAO.run(`
            UPDATE users SET username=? WHERE id=?
            ;`, [
                newUsername,
                query
            ]);
        } else {
            return await AppDAO.run(`
            UPDATE users SET username=? WHERE username=?
            ;`, [
                newUsername,
                query
            ]);
        }
    }

    static async updateUserStatus(query, status) {
        const bool = status === false ? 0 : 1;
        // status为false时账户为启用状态，数据库内为1
        // status为true时账户为禁用状态，数据库内为0
        if (typeof query === "number") {
            return await AppDAO.run(`
            UPDATE users SET disabled=? WHERE id=?
            ;`, [
                bool,
                query
            ]);
        } else {

            return await AppDAO.run(`
            UPDATE users SET disabled=? WHERE username=?
            ;`, [
                bool,
                query
            ]);
        }
    }

    static async deleteUser(user_id) {
        return await AppDAO.run(`
        DELETE FROM users WHERE id=?
        ;`, [
            user_id
        ]);
    }

    static async validateUsername(username) {
        const queryResult = await AppDAO.get(`
        SELECT username, password, disabled FROM users WHERE username=?
        ;`, [
            username
        ]);
        return queryResult;
    }

    static async validateAccount(input_username, input_password, ) {
        const queryResult = await this.validateUsername(input_username);
        if (!queryResult) return {
            status: false,
            message: "账号不存在!",
            type: "username"
        };
        const { username, password, disabled } = queryResult;
        if (disabled === 1) return {
            status: false,
            message: "账户已被禁用!",
            type: "username"
        }

        const status = await validateData(input_password, password);
        return {
            status,
            message: status ? "验证成功!" : "密码错误!",
            type: "password"
        };
    }

    static async getUserGroup(username) {
        const { group_id } = await AppDAO.get(`
        SELECT group_id FROM users WHERE username=?
        ;`, [
            username
        ]);
        const { usergroup: group } = await AppDAO.get(`
        SELECT usergroup FROM groups WHERE id=?
        ;`, [
            group_id
        ]);
        return {
            group,
            group_id
        }
    }

    static async getUserAuthority(username, needGroup = false) {
        const { group_id, group } = await this.getUserGroup(username);
        const authorityList = await Promise.all((await AppDAO.all(`
        SELECT authority_id FROM groups_authority WHERE usergroup_id=?
        ;`, [
            group_id
        ]))
            .map(({ authority_id }) => AuthorityTask.getAuthorityDetails(authority_id)));
        const result = {
            authorityList
        }
        if (needGroup) {
            result.group = group;
            result.group_id = group_id;
        }
        return result;
    }

    static async getUserDetails(username) {
        const result = await AppDAO.get(`
        SELECT id, username, group_id, disabled FROM users WHERE username=?
        ;`, username);

        if (!result) return result;

        return (await this.mapValueToText([result]))[0];
    }
}

export default UsersTask;