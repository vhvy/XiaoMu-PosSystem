import AppDAO from "../data/AppDAO";

class UsersMangle {
    constructor() {
        this.dao = new AppDAO();
    }

    async getAllUser() {

    }

    async createAdmin({
        username,
        password,
    }) {

    }

    async createUser({
        username,
        password,
        group
    }) {

    }

    async changeUser() {

    }

    async disabledUser() {

    }

    async deleteUser() {

    }
}

export default UsersMangle;