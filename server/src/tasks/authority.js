import AppDAO from "../data/AppDAO.js";

class AuthorityTask {

    static async getAuthorityDetails(auth) {
        const query = (typeof auth === "number") ? "id" : "authority";
        const result = await AppDAO.get(`
        SELECT id, authority FROM authority WHERE ${query}=?
        ;`, [
            auth
        ]);
        return result;
    }

    static async getAllAuthority() {
        return await AppDAO.all(`
        SELECT id, authority FROM authority
        ;`);
    }

    static async mapAuthorityNameToID(name) {
        const getID = (name) => {
            return AppDAO.get(`
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

    static async validateAuthority(auth) {
        // 判断权限是否合法

        const valid = async (auth) => {
            const query = (typeof auth === "number") ? "id" : "authority";
            return Boolean(await AppDAO.get(`
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