import AppDAO from "../data/AppDAO.js";
import { validateData } from "../lib/encryptPwd.js";
import AuthorityTask from "./authority.js";
import GroupTask from "./groups.js";

class UsersTask {
    constructor() {
        this.dao = AppDAO;
    }

    async getAllUser() {
        const GroupManage = new GroupTask();
        const all_user_list = await this.dao.all(`
        SELECT id, username, group_id, disabled FROM users
        ;`);
        const result = await Promise.all(all_user_list
            .map(async ({ group_id, id, username, disabled }) => {
                const { usergroup } = await GroupManage.getGroupDetails(group_id);
                return {
                    id,
                    username,
                    disabled,
                    group_id,
                    group: usergroup
                }
            }));
        return result;
    }

    createUser(
        username,
        hash,
        group_id
    ) {
        return this.dao.run(`
        INSERT INTO users 
        (username, password, group_id)
        VALUES (?, ?, ?)
        ;`, [
            username,
            hash,
            group_id
        ]);
    }

    async changeUserGroup(user, new_group) {
        const user_query = (typeof user === "number") ? "id" : "username";
        const GroupManage = new GroupTask();
        const { id } = await GroupManage.getGroupDetails(new_group);
        return this.dao.run(`
        UPDATE users SET group_id=? WHERE ${user_query}=?
        ;`, [
            id,
            user
        ]);
    }

    changeUserPwd(queryUser, newPwd) {
        if (typeof queryUser === "number") {
            return this.dao.run(`
        UPDATE users SET password=? WHERE id=?
        ;`, [
                newPwd,
                queryUser
            ]);
        } else {
            return this.dao.run(`
        UPDATE users SET password=? WHERE username=?
        ;`, [
                newPwd,
                queryUser
            ]);
        }
    }

    changeUserName(query, newUsername) {
        // query是老用户名
        if (typeof query === "number") {
            return this.dao.run(`
            UPDATE users SET username=? WHERE id=?
            ;`, [
                newUsername,
                query
            ]);
        } else {
            return this.dao.run(`
            UPDATE users SET username=? WHERE username=?
            ;`, [
                newUsername,
                query
            ]);
        }
    }

    updateUserStatus(query, status) {
        const bool = status === false ? 1 : 0;
        // status为true时账户为启用状态，数据库内为0
        // status为false时账户为禁用状态，数据库内为1
        if (typeof query === "number") {
            return this.dao.run(`
            UPDATE users SET disabled=? WHERE id=?
            ;`, [
                bool,
                query
            ]);
        } else {

            return this.dao.run(`
            UPDATE users SET disabled=? WHERE username=?
            ;`, [
                bool,
                query
            ]);
        }
    }

    deleteUser(user_id) {
        return this.dao.run(`
        DELETE FROM users WHERE id=?
        ;`, [
            user_id
        ]);
    }

    async validateUsername(username) {
        const queryResult = await this.dao.get(`
        SELECT username, password, disabled FROM users WHERE username=?
        ;`, [
            username
        ]);
        return queryResult;
    }

    async validateAccount(input_username, input_password, ) {
        const queryResult = await this.validateUsername(input_username);
        if (!queryResult) return {
            status: false,
            message: "账号不存在!"
        };
        const { username, password, disabled } = queryResult;
        if (disabled === 1) return {
            status: false,
            message: "账户已被禁用!"
        }
        
        const status = await validateData(input_password, password);
        return {
            status,
            message: status ? "验证成功!" : "密码错误!"
        };
    }

    async getUserGroup(username) {
        const { group_id } = await this.dao.get(`
        SELECT group_id FROM users WHERE username=?
        ;`, [
            username
        ]);
        const { usergroup: group } = await this.dao.get(`
        SELECT usergroup FROM groups WHERE id=?
        ;`, [
            group_id
        ]);
        return {
            group,
            group_id
        }
    }

    async getUserAuthority(username, needGroup = false) {
        const { group_id, group } = await this.getUserGroup(username);
        const AuthorityManage = new AuthorityTask();
        const authorityList = await Promise.all((await this.dao.all(`
        SELECT authority_id FROM groups_authority WHERE usergroup_id=?
        ;`, [
            group_id
        ]))
            .map(({ authority_id }) => AuthorityManage.getAuthorityDetails(authority_id)));
        const result = {
            authorityList
        }
        if (needGroup) {
            result.group = group;
            result.group_id = group_id;
        }
        return result;
    }

    getUserDetails(username) {
        return this.dao.get(`
        SELECT id, username, group_id, disabled FROM users WHERE username=?
        ;`, [
            username
        ]);
    }
}

export default UsersTask;