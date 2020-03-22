import React, { createContext, useContext } from "react";
import { connect } from "react-redux";
import {
    clearUserLoginStateAction,
    setUserDetailsAction,
    setStoreName
} from "../../redux/action";
import { TokenManage } from "../../tasks/tokenManage";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function _AuthProvider({
    children,
    isLogin,
    username,
    authority,
    isAdmin,
    clearUserState,
    setUserDetails,
    setStoreName
}) {

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
        console.log("logout")
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

function mapStateToProps(state) {
    const { username, authority, isLogin, isAdmin, } = state.userDetails;
    return {
        isLogin,
        isAdmin,
        username,
        authority
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearUserState: () => dispatch(clearUserLoginStateAction()),
        setUserDetails: (value) => dispatch(setUserDetailsAction(value)),
        setStoreName: (name) => dispatch(setStoreName(name))
    };
}

export const AuthProvider = connect(mapStateToProps, mapDispatchToProps)(_AuthProvider);