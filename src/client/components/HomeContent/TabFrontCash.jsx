import React, { useEffect } from "react";
import { Tabs, Form, Input, Row, Col, Button, message as antd_message, Modal } from "antd";
import style from "../../styles/front_cash.scss";
import { connect } from "react-redux";
import { setCurrentOrderNumberAction } from "../../redux/action";
import { http } from "../../tools/http";
import { CashInputCommodity } from "./CashInputCommodity";
import { Check } from "./Cash/Check";

const { TabPane } = Tabs;

function _TabFrontCash({ setCurrentOrderNumber }) {

    useEffect(() => {
        async function setOrderNumber() {
            try {
                const { status, data } = await http.get("/api/cash/new");
                if (status === 200) {
                    const { order_number } = data;
                    setCurrentOrderNumber(order_number);
                }
            } catch (error) {
                const { message } = error;
                antd_message.error(message);
            }
        }

        setOrderNumber();
    }, []);

    return (
        <div
            className={style["frontcash-wrap"]}
        >
            <Row>
                <Col span={21}>
                    <CashInputCommodity />
                </Col>
                <Col span={3}>
                    <Check />
                </Col>
            </Row>
        </div>
    );
}

function Cash_MapDispatchToProps(dispatch) {
    return {
        setCurrentOrderNumber: number => dispatch(setCurrentOrderNumberAction(number))
    }
}

const TabFrontCash = connect(null, Cash_MapDispatchToProps)(_TabFrontCash);

export {
    TabFrontCash
}