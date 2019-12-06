import AppDAO from "../data/AppDAO.js";

class AuthorityTask {
    constructor() {
        this.dao = AppDAO;
    }

    async getAuthorityDetails(auth) {
        const query = (typeof auth === "number") ? "id" : "authority";
        const result = await this.dao.get(`
        SELECT id, authority FROM authority WHERE ${query}=?
        ;`, [
            auth
        ]);
        return result;
    }

    getAllAuthority() {
        return this.dao.all(`
        SELECT id, authority FROM authority
        ;`);
    }

    async mapAuthorityNameToID(name) {
        const getID = (name) => {
            return this.dao.get(`
            SELECT id FROM authority WHERE authority=?
            ;`, [name]);
        }

        if (Array.isArray(name)) {
            return Promise.all(name.map(
                async i => (await getID(i))["id"]
            ));
        }

        return getID(name);
    }

    async validateAuthority(auth) {
        // 判断权限是否合法

        const valid = async (auth) => {
            const query = (typeof auth === "number") ? "id" : "authority";
            return Boolean(await this.dao.get(`
            SELECT id FROM authority WHERE ${query}=?
            ;`, [
                auth
            ]));
        }

        if (Array.isArray(auth)) {
            for (let i of auth) {
                const result = await valid(i);
                if (!result) return false;
            }
            return true;
        }
        return valid(auth);
    }
}

export default AuthorityTask;