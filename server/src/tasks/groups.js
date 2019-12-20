import AppDAO from "../data/AppDAO.js";
import AuthorityTask from "./authority.js";

class GroupTask {

    static async getAllGroup() {
        // 获取所有权限详情

        const groupList = await AppDAO.all(`
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

    static async getGroupAuthority(group_id, onlyID = false) {
        // 获取传入用户组ID的权限
        // onlyID为false时返回权限详细信息，反之则仅返回权限id

        const authority_id_list = await AppDAO.all(`
        SELECT usergroup_id, authority_id FROM groups_authority WHERE usergroup_id=?
        ;`, [
            group_id
        ]);
        // 查询用户组所用的所有权限ID

        if (onlyID) {
            return authority_id_list;
        }

        return await Promise.all(
            authority_id_list.map(
                async ({ authority_id }) =>
                    await AuthorityTask.getAuthorityDetails(authority_id)

            )
        );
        // 返回所有权限的完整信息
    }

    static async getGroupDetails(group) {
        // 获取传入用户组的详情

        const query = (typeof group === "number") ? "id" : "usergroup";
        return await AppDAO.get(`
        SELECT usergroup, id FROM groups WHERE ${query}=?
        ;`, [
            group
        ]);
    }


}

export default GroupTask;