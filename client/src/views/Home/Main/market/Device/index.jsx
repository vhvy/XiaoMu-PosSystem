import React, { useState, useMemo } from "react";
import styled from "../../../../../styles/device.scss";
import { Card, Modal } from "antd";
import { Scale } from "./Scale";
import { PosPrint } from "./PosPrint";
import { ClientDisplay } from "./ClientDisplay";
import { MoneyBox } from "./MoneyBox";



export function Device() {

    const config = [
        {
            id: "scale",
            title: "电子秤管理",
            component: <Scale closeFn={closeModal} />,
            modalWidth: 410
        },
        {
            id: "pos-print",
            title: "小票机管理",
            component: <PosPrint closeFn={closeModal} />
        },
        {
            id: "client-display",
            title: "客显管理",
            component: <ClientDisplay closeFn={closeModal} />
        },
        {
            id: "money-box",
            title: "钱箱管理",
            component: <MoneyBox closeFn={closeModal} />
        }
    ];

    const [modalData, setModalData] = useState({
        status: true,
        id: config[1].id
    });

    const { title, component, modalWidth } = useMemo(() => config.find(i => i.id === modalData.id), [modalData.id]);

    function closeModal() {
        setModalData(s => ({
            ...s,
            status: false
        }));
    }


    function handleClick(id) {
        setModalData(s => ({
            ...s,
            id,
            status: true
        }));
    }

    return (
        <div className={styled["device-wrap"]}>
            <Card title="设备列表">
                {
                    config.map(({ id, title }) => (
                        <Card.Grid onClick={handleClick.bind(null, id)} key={id}>{title}</Card.Grid>
                    ))
                }
            </Card>
            <Modal
                visible={modalData.status}
                title={title}
                onCancel={closeModal}
                footer={null}
                width={modalWidth}
            >
                {component}
            </Modal>
        </div>
    );
}