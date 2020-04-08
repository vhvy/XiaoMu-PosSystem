class Users {
    static async changePwd(http, args) {
        // 修改用户密码
        try {
            const { data, status } = await http.post("/api/users/updatepwd", args);
            return {
                status: status === 200 ? true : false,
                message: data.message
            }
        } catch (err) {
            const { data } = err;
            return {
                status: false,
                message: data.message
            }
        }
    }

    static getAllUser(ajax) {
        return ajax.get("/api/users");
    }

    static createUser(ajax, new_username, password, group) {
        return ajax.post("/api/users/createuser", {
            new_username,
            password,
            group
        });
    }

    static changeUsername(ajax, old_username, new_username) {
        return ajax.post("/api/users/updateusername", {
            old_username,
            new_username
        });
    }

    static changeUserPwd(ajax, username, new_password) {
        return ajax.put("/api/users/updatepwd", {
            username,
            new_password
        });
    }

    static changeUserGroup(ajax, username, new_group) {
        return ajax.put("/api/users/updateusergroup", {
            username,
            new_group
        });
    }

    static changeUserStatus(ajax, username, status) {
        return ajax.put("/api/users/updateuserstatus", {
            username,
            status
        });
    }
}

export default Users;
export {
    Users
};