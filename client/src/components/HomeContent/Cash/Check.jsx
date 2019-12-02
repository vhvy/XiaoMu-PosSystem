import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Card, Input, Button } from "antd";
import { connect } from "react-redux";
import {
    setCashCheckModalStatusAction,
    setGuestPayAmountAction
} from "../../../redux/action";
import { CashButton } from "./CashButton";
import style from "../../../styles/front_cash.scss";

function ModalLeft({
    orderPayAmount,
    orderPayAmountActual,
    guestPayAmount,
    giveGuestChange
}) {
    return (
        <Card
            title="收款合计"
            size="small"
            hoverable={false}
        >
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >应收:</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >{orderPayAmount}</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >实收:</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >{orderPayAmountActual}</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >收款:</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >{guestPayAmount === "" ? 0 : guestPayAmount}</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >找零:</Card.Grid>
            <Card.Grid
                hoverable={false}
                className={style["front-check-details"]}
            >{giveGuestChange}</Card.Grid>
        </Card>
    );
}

function ModalRight({
    setGuestPayAmount,
    guestPayAmount
}) {

    let inputRef;

    function handleGuestPayInput({ target }) {
        setGuestPayAmount(target.value);
    }

    useEffect(() => {
        inputRef.focus();
        inputRef.select();
    }, []);

    return (
        <Card className={style["front-check-pay"]}>
            <Input
                className={style["front-check-pay-input"]}
                ref={input => inputRef = input}
                type="number"
                value={guestPayAmount}
                onChange={handleGuestPayInput}
            />
            <Button type="primary" style={{
                float: "right"
            }}>结账</Button>
        </Card>
    );
}

function _Check({
    modalStatus,
    setModalStatus,
    setGuestPayAmount,
    guestPayAmount,
    orderPayAmount,
    orderPayAmountActual,
    giveGuestChange
}) {

    function closeModal() {
        setModalStatus(false);
    }

    return (
        <>
            <CashButton handleClick={setModalStatus.bind(null, true)} name="结账" hotkey="+" />
            <Modal
                title="结账窗口"
                visible={modalStatus}
                footer={null}
                destroyOnClose
                onCancel={closeModal}
            >
                <Row>
                    <Col span={10}>
                        <ModalLeft
                            giveGuestChange={giveGuestChange}
                            guestPayAmount={guestPayAmount}
                            orderPayAmount={orderPayAmount}
                            orderPayAmountActual={orderPayAmountActual}
                        />
                    </Col>
                    <Col span={14}>
                        <ModalRight
                            guestPayAmount={guestPayAmount}
                            setGuestPayAmount={setGuestPayAmount}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    );
}

function mapStateToProps(state) {
    const { cash } = state;
    const { checkState } = cash;
    return {
        modalStatus: cash.fnModalStatus.checkModalStatus,
        guestPayAmount: checkState.guestPayAmount,
        orderPayAmount: checkState.orderPayAmount,
        orderPayAmountActual: checkState.orderPayAmount,
        giveGuestChange: checkState.giveGuestChange
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setModalStatus: status => dispatch(setCashCheckModalStatusAction(status)),
        setGuestPayAmount: num => dispatch(setGuestPayAmountAction(num))
    };
}

const Check = connect(
    mapStateToProps,
    mapDispatchToProps
)(_Check);

export {
    Check
};