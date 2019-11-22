import AppDAO from "../data/AppDAO";

class GroupTask {
    constructor() {
        this.dao = new AppDAO();
    }

    async getAllGroup() {
        return [
            {
                type: "admin",
                name: "root"
            },
            {
                type: "admin",
                name: "root1"
            },
            {
                type: "admin",
                name: "root2"
            }
        ];
    }

    async deleteGroup(group) {
        return group;
    }

    async createGroup({
        type,
        authority
    }) {
        return {
            type,
            authority
        }
    }

    async changeGroup({
        group
    }) {
        return group;
    }
}

export default GroupTask;