import { createContext } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { updateUserInfo, saveLoginInfo, clearLoginInfo } from "@/store/module/app";

export interface LoginSuccessPayload {
    userInfo: UserInfo,
    token: string
}

interface HandleLoginSuccess {
    (payload: LoginSuccessPayload): void
}

interface HandleLogout {
    (): void
}

interface HandleUpdateUserInfo {
    (payload: UserInfo): void
}

interface AuthContext {
    isLogin: boolean,
    userInfo: UserInfo,

    handleLogout: HandleLogout,
    handleLoginSuccess: HandleLoginSuccess
    handleUpdateUserInfo: HandleUpdateUserInfo
};

export const AuthContext = createContext<AuthContext>({} as AuthContext);

type Props = {
    children: React.ReactElement
}

const AuthProvider = ({ children }: Props) => {

    const { isLogin, userInfo } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();

    const handleLogout: HandleLogout = () => dispatch(clearLoginInfo());

    const handleLoginSuccess: HandleLoginSuccess = (payload) => dispatch(saveLoginInfo(payload));

    const handleUpdateUserInfo: HandleUpdateUserInfo = (payload) => dispatch(updateUserInfo(payload));

    const authValue = {
        isLogin,
        userInfo,

        handleLogout,
        handleLoginSuccess,
        handleUpdateUserInfo
    };

    return (
        <AuthContext.Provider value={authValue} children={children} />
    );
}

export default AuthProvider;