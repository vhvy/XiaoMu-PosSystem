import React, { createContext, useContext, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    clearUserLoginStateAction,
    setUserDetailsAction,
    setStoreNameAction
} from "../../redux/action";
import { TokenManage } from "../../tasks/tokenManage";

const selector = ({ userDetails }) => {
    const { username, authority, isLogin, isAdmin, } = userDetails;
    return {
        isLogin,
        isAdmin,
        username,
        authority
    };
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({
    children,
}) {

    const dispatch = useDispatch();

    const {
        clearUserState,
        setUserDetails,
        setStoreName
    } = useMemo(() => ({
        clearUserState: () => dispatch(clearUserLoginStateAction()),
        setUserDetails: (value) => dispatch(setUserDetailsAction(value)),
        setStoreName: (name) => dispatch(setStoreNameAction(name))
    }), [dispatch]);

    const {
        isLogin,
        isAdmin,
        username,
        authority
    } = useSelector(selector);

    function login(token, details) {
        if (token) {
            TokenManage.save(token);
        }
        if (details) {
            const { username, authority, isAdmin } = details;
            setUserDetails({
                username,
                authority,
                isAdmin,
                isLogin: true
            });
        }
    }

    function logout() {
        TokenManage.clean();
        clearUserState();
    }

    const value = {
        isAdmin,
        isLogin,
        login,
        logout,
        username,
        authority,
        setStoreName
    };

    return <AuthContext.Provider value={value} children={children} />;
}