import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import styled from "../../styles/loading.scss";
import { TokenManage } from "../../tasks/tokenManage";
import { useHistory } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useAjax } from "../AjaxProvider";

export function Loading() {

    const { login } = useAuth();
    const ajax = useAjax();
    const hasToken = TokenManage.Token;
    const [isLoading, setIsLoading] = useState(Boolean(hasToken));
    let history = useHistory();
    useEffect(() => {
        async function validToken() {
            const result = await TokenManage.validToken(ajax);
            if (!result) {
                history.replace("/login");
            } else {
                const { username, authority, isAdmin } = result;
                login(null, {
                    username, authority, isAdmin
                });
            }

            setIsLoading(false);
        }

        validToken();
    }, []);

    const classNameList = [[styled["loading-wrap"]]];
    if (!isLoading) classNameList.push(styled["hide"]);

    return (
        <Layout className={classNameList}>
            <Spin size="large" spinning={isLoading} />
        </Layout>
    );
}
