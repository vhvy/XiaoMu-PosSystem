import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";

const useAuth = () => {
    const {
        isLogin,
        userInfo,

        handleLogout,
        handleLoginSuccess,
        handleUpdateUserInfo
    } = useContext(AuthContext);


    return {
        isLogin,
        userInfo,

        handleLogout,
        handleLoginSuccess,
        handleUpdateUserInfo
    }
}


export default useAuth;