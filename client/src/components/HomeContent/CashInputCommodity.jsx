import React, { useState, useEffect } from "react";
import { From, Input, Row, Button } from "antd";
import { connect } from "react-redux";
import style from "../../styles/front_cash.scss";
import {
    inputBarcodeAction,
    setCashCheckModalStatusAction
} from "../../redux/action";
import { cash_hotkey as hotkey } from "../../config/hotkey";

const { Search } = Input;

function _CashInputCommodity({
    currentInputBarcode,
    setInputValue,
    openCheckModal
}) {

    const commodityCount = 10;
    const commoditySum = 218.7;
    let inputRef;

    useEffect(() => {
        inputRef.focus();
    }, []);

    function handleSearch(e) {
        console.log(e);
    }

    function handleHotKey({ key }) {
        switch (key) {
            case hotkey.CASH_CHECK:
                openCheckModal();
                break;
        }
    }

    return (
        <div className={style["frontcash-top-wrap"]}>
            <Row>
                <Search
                    value={currentInputBarcode}
                    onChange={setInputValue}
                    onSearch={handleSearch}
                    onKeyDown={handleHotKey}
                    ref={input => inputRef = input}
                    className={style["frontcash-barcode-input"]}
                />
            </Row>
            <div className={style["frontcash-top-count"]}>
                <p>数量: {commodityCount}</p>
                <p>总额: {commoditySum}</p>
            </div>
        </div>
    );
}

function CashInput_MapStateToProps(state) {
    return {
        currentInputBarcode: state.cash.currentInputBarcode
    }
}

function CashInput_MapDispatchToProps(dispatch) {
    return {
        setInputValue: e => dispatch(inputBarcodeAction(e.target.value)),
        openCheckModal: () => dispatch(setCashCheckModalStatusAction(true))
    }
}

const CashInputCommodity = connect(
    CashInput_MapStateToProps,
    CashInput_MapDispatchToProps
)(_CashInputCommodity);

export {
    CashInputCommodity
}