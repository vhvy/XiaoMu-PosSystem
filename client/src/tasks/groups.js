export class GroupManage {
    static async getAllGroup(ajax) {
        return ajax.get("/api/groups");
    }
}