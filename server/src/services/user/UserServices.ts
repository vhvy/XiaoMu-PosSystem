import Expection from "@/base/exception";
import User from "@/model/user/User";
import { TokenUserInfo } from "@/types/user";
import { encrypt } from "@/utils/crypto";
import { createToken } from "@/utils/jwt";


export default class UserServices {
    public static async handleLogin(_account: string, password: string) {

        const userInfo = await User.findOne({
            where: {
                account: _account
            }
        });

        if (!userInfo) throw new Expection("账号不存在!", 401);

        const currentPwdHex = encrypt("sha256", password);

        if (currentPwdHex !== userInfo.password) throw new Expection("密码错误!", 401);

        const { uid, username, account } = userInfo;

        const tokenContent: TokenUserInfo = {
            uid
        };

        const token = createToken(tokenContent);


        return {
            token,
            userInfo: {
                uid, username, account
            }
        };
    }
}