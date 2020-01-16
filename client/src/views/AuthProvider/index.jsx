import React, { createContext, useContext } from "react";
import { connect } from "react-redux";
import {
    clearUserLoginStateAction,
    setUserIsAdminAction,
    setUserIsLoginAction,
    setCurrentUserAuthorityAction,
    setCurrentUsernameAction,
    setUserDetailsAction
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
    setUserName,
    setUserAuthority,
    setUserIsLogin,
    setUserIsAdmin,
    setUserDetails
}) {

    function login(token, details) {
        if (token) {
            TokenManage.save(token);
        }
        if (details) {
            const { username, authority, isAdmin } = details;
            // setUserIsAdmin(isAdmin);
            // setUserName(username);
            // setUserAuthority(authority);
            // setUserIsLogin(true);
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
        authority
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
        setUserName: (name) => dispatch(setCurrentUsernameAction(name)),
        setUserAuthority: (auth) => dispatch(setCurrentUserAuthorityAction(auth)),
        setUserIsLogin: (bool) => dispatch(setUserIsLoginAction(bool)),
        setUserIsAdmin: (bool) => dispatch(setUserIsAdminAction(bool)),
        setUserDetails: (value) => dispatch(setUserDetailsAction(value))
    }
}

export const AuthProvider = connect(mapStateToProps, mapDispatchToProps)(_AuthProvider);