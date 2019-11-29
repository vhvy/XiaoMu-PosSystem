import React from "react";
import style from "../../../styles/front_cash.scss";

function CashButton({
    name,
    hotkey,
    handleClick
}) {
    return (
        <div className={style["frontcash-fn-btn"]} onClick={handleClick}>
            <span>{name}</span>
            <span>&lt;{hotkey}&gt;</span>
        </div>
    );
}

export {
    CashButton
};