import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import styled from "../../styles/loading.scss";
import { TokenManage } from "../../tasks/tokenManage";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useAjax } from "../AjaxProvider";

export function Loading() {

    const { login, setStoreName } = useAuth();

    const ajax = useAjax();

    const hasToken = Boolean(TokenManage.Token);
    // 是否拥有保存的token

    const [isLoading, setIsLoading] = useState(hasToken);
    // 如果有token则加载动画并进行验证
    // 否则隐藏加载动画

    let history = useHistory();

    let location = useLocation();

    useEffect(() => {

        const { pathname } = location;

        async function validToken() {

            try {
                const { data } = await TokenManage.validToken(ajax);
                const { user_values, store_name } = data;

                const { username, authority, isAdmin } = user_values;
                login(null, {
                    username, authority, isAdmin
                });
                setStoreName(store_name);
            } catch (error) {
                history.replace("/login", {
                    from: pathname
                });
            }

            setIsLoading(false);
        }
        if (pathname === "/login" || !hasToken) return;
        // 当前页面为登录界面或没有token时不对token进行验证

        // 否则进行验证

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
