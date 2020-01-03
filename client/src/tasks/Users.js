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
}

export default Users;
export {
    Users
};