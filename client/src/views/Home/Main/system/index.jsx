import React, { useState, useMemo } from "react";
import styled from "../../../../styles/system.scss";
import { Card, Modal } from "antd";
import { useAjax } from "../../../AjaxProvider";
import { StoreName } from "./StoreName";

export function System() {

    const ajax = useAjax();

    const config = [
        {
            id: "store-name",
            title: "店名设置",
            modalWidth: 380,
            component: useMemo(() => <StoreName ajax={ajax} closeFn={closeModal} />, [closeModal])
        }
    ];

    const [modalData, setModalData] = useState({
        status: false,
        id: config[0].id
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
        <div className={styled["system-wrap"]}>
            <Card title="系统设置">
                {
                    config.map(({ id, title }) => (
                        <Card.Grid
                            onClick={handleClick.bind(null, id)}
                            key={id}
                        >
                            {title}
                        </Card.Grid>
                    ))
                }
            </Card>
            <Modal
                visible={modalData.status}
                title={title}
                onCancel={closeModal}
                footer={null}
                width={modalWidth}
                destroyOnClose
            >
                {component}
            </Modal>
        </div>
    );
}