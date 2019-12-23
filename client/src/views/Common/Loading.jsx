import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import styled from "../../styles/loading.scss";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { TokenManage } from "../../tasks/tokenManage";
import {
    setCurrentUserAuthorityAction,
    setCurrentUsernameAction,
    setUserIsLoginAction
} from "../../redux/action";

export function _Loading({ setUserAuthority, setUserIsLogin, setUserName }) {



    const hasToken = TokenManage.Token;
    const [isLoading, setIsLoading] = useState(Boolean(hasToken));
    let history = useHistory();

    useEffect(() => {
        async function validToken() {
            const result = await TokenManage.validToken();
            if (!result) {
                history.replace("/login");
            } else {
                const { username, authority } = result;
                setUserIsLogin(true);
                setUserAuthority(authority);
                setUserName(username);
            }

            setIsLoading(false);
        }

        validToken();
    }, []);

    const classNameList = [[styled["loading-wrap"]]];
    if (!isLoading) classNameList.push(styled["hide"]);

    return (<Layout className={classNameList}>
        <Spin size="large" spinning={isLoading} />
    </Layout>);
}

function mapDispatchToProps(dispatch) {
    return {
        setUserIsLogin: (bool) => dispatch(setUserIsLoginAction(bool)),
        setUserName: (name) => dispatch(setCurrentUsernameAction(name)),
        setUserAuthority: (list) => dispatch(setCurrentUserAuthorityAction(list))
    }
}

export const Loading = connect(null, mapDispatchToProps)(_Loading);