import UserModel from "@/app/model/User";

export default class UserService {
    static model = UserModel;

    static async query() {
        const result = await this.model.getAllUser();
        console.log(result);
    }
}