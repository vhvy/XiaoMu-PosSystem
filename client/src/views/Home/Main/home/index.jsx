import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "../../../../styles/home.scss";
import { useAjax } from "../../../AjaxProvider";
import { LoadingBox } from "../../../../components/LoadingBox";
import { TodayTasks } from "../../../../tasks/today";
import { Admin } from "./Admin";
import { Cashier } from "./Cashier";

const selector = ({ store_name, userDetails }) => ({ store_name, isAdmin: userDetails.isAdmin, isLogin: userDetails.isLogin });

const initState = {
    status: true,
    data: {}
};

export function Home() {


    const ajax = useAjax();

    const { isAdmin, isLogin } = useSelector(selector);

    const [baseData, setData] = useState(initState);

    const { status } = baseData;

    async function getData() {

        try {
            const { data } = await TodayTasks.getTodayData(ajax);

            setData(s => ({
                ...s,
                status: false,
                data
            }));
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getData();
    }, []);

    const component = useMemo(() => !isLogin ? null : isAdmin ?
        <Admin {...baseData} /> : <Cashier {...baseData} />, [isLogin, isAdmin, baseData]
    );
    
    return (
        <div className={styled["home-wrap"]}>
            <LoadingBox noPadding={true} status={status} tip="加载数据中，请稍候..." />
            {component}
        </div>
    );
}