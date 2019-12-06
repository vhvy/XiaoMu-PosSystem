import AppDAO from "../data/AppDAO.js";
import AuthorityTask from "./authority.js";

class GroupTask {
    constructor() {
        this.dao = AppDAO;
    }

    async getAllGroup() {
        // 过去所有权限详情

        const groupList = await this.dao.all(`
        SELECT usergroup, id FROM groups
        ;`);
        const result = await Promise.all(
            groupList.map(async ({
                usergroup,
                id
            }) => {
                return {
                    usergroup,
                    id,
                    authority: await this.getGroupAuthority(id)
                }
            })
        );

        return result;
    }

    async getGroupAuthority(group_id, onlyID = false) {
        // 获取传入用户组ID的权限
        // onlyID为false时返回权限详细信息，反之则仅返回权限id

        const authority_id_list = await this.dao.all(`
        SELECT usergroup_id, authority_id FROM groups_authority WHERE usergroup_id=?
        ;`, [
            group_id
        ]);
        // 查询用户组所用的所有权限ID

        if (onlyID) {
            return authority_id_list;
        }

        const AuthorityManage = new AuthorityTask();
        return await Promise.all(
            authority_id_list.map(
                async ({ authority_id }) =>
                    await AuthorityManage.getAuthorityDetails(authority_id)

            )
        );
        // 返回所有权限的完整信息
    }

    getGroupDetails(group) {
        // 获取传入用户组的详情

        const query = (typeof group === "number") ? "id" : "usergroup";
        return this.dao.get(`
        SELECT usergroup, id FROM groups WHERE ${query}=?
        ;`, [
            group
        ]);
    }

    async deleteGroup(group) {
        // 删除一个用户组

        return group;
    }

    async createGroup(
        group,
        authorityIDList
    ) {
        // 创建一个新的用户组

        const { lastID } = await this.dao.run(`
        INSERT INTO groups (usergroup) VALUES (
            ?
        )
        ;`, [
            group
        ]);
        await Promise.all(authorityIDList.map(
            id => this.setGroupAuthority(lastID, id)
        ));
    }

    async setGroupAuthority(group_id, authority) {
        // 设置一个用户组的权限

        const addID = (id) => {
            return this.dao.run(`
        INSERT INTO groups_authority 
        (usergroup_id, authority_id) 
        VALUES (?, ?)
        ;`, [
                group_id, id
            ]);
        }

        if (Array.isArray(authority)) {
            return Promise.all(authority.map(
                async id => await addID(id)
            ));
        }

        return addID(authority);
    }

    async deleteGroupAuthority(group_id, authority) {
        // 删除一个用户组的权限

        const removeID = (id) => {
            return this.dao.run(`
        DELETE FROM groups_authority 
        WHERE (usergroup_id=?) AND (authority_id=?)
        ;`, [
                group_id, id
            ]);
        }

        if (Array.isArray(authority)) {
            return Promise.all(authority.map(
                async id => await removeID(id)
            ));
        }

        return removeID(authority);
    }

    async updateGroupAuthority(group, new_authority) {
        // 修改一个用户组的权限
        let group_id = group;
        if (typeof group === "string") {
            group_id = (await this.dao.get(`
            SELECT id FROM groups WHERE usergroup=?
            ;`, [group]))["id"];
        }

        const current_authority = (await this.getGroupAuthority(group, true))
            .map(({ authority_id }) => authority_id);
        // 用户组当前拥有的所有权限ID

        const need_add_authority = new_authority.filter(auth => !current_authority.includes(auth));
        // 需要添加的权限ID列表

        const need_remove_authority = current_authority.filter(auth => !new_authority.includes(auth));
        // 需要移除的权限ID列表

        await this.setGroupAuthority(group_id, need_add_authority);

        await this.deleteGroupAuthority(group_id, need_remove_authority);
    }

    updateGroupName(group, new_name) {
        // 修改一个用户组的名称

        const query = (typeof group === "number") ? "id" : "usergroup";
        return this.dao.run(`
        UPDATE groups SET usergroup=? WHERE ${query}=?
        ;`, [
            new_name,
            group
        ]);
    }
}

export default GroupTask;