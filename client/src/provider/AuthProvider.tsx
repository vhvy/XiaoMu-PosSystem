import { createContext } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { updateUserInfo, saveLoginInfo, clearLoginInfo } from "@/store/module/app";
import { UserInfo } from "@/types/user";

interface ILoginSuccessPayload {
    userInfo: UserInfo,
    token: string
}

interface IHandleLoginSuccess {
    (payload: ILoginSuccessPayload): void
}

interface IHandleLogout {
    (): void
}

interface IHandleUpdateUserInfo {
    (payload: UserInfo): void
}

interface IAuthContext {
    isLogin: boolean,
    userInfo: UserInfo,

    handleLogout: IHandleLogout,
    handleLoginSuccess: IHandleLoginSuccess
    handleUpdateUserInfo: IHandleUpdateUserInfo
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

type Props = {
    children: React.ReactElement
}

const AuthProvider = ({ children }: Props) => {

    const { isLogin, userInfo } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();

    const handleLogout: IHandleLogout = () => dispatch(clearLoginInfo());

    const handleLoginSuccess: IHandleLoginSuccess = (payload) => dispatch(saveLoginInfo(payload));

    const handleUpdateUserInfo: IHandleUpdateUserInfo = (payload) => dispatch(updateUserInfo(payload));

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