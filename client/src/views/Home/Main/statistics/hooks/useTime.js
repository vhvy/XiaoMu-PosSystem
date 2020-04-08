import React, { useState } from "react";
import { Button, DatePicker, Modal } from "antd";
import styled from "../../../../../styles/statistics/usetime.scss";
import moment from "moment";

const { RangePicker } = DatePicker;

function TimeModal({
    value,
    status,
    setCurrentTime,
    closeFn,
    showFn,
    flushFn
}) {

    const btn_list = [
        {
            label: "前一天",
            start_time: () => moment().subtract(1, "day").startOf("day")
        },
        {
            label: "今天",
            start_time: () => moment().startOf("day")
        },
        {
            label: "七天",
            start_time: () => moment().subtract(6, "days").startOf("day")
        },
        {
            label: "一个月",
            start_time: () => moment().subtract(1, "months").startOf("day")
        },
        {
            label: "一年",
            start_time: () => moment().subtract(1, "years").startOf("day")
        }
    ];

    function handleTimeBtnClick(label) {

        const end_time = moment().endOf("day");
        const { start_time } = btn_list.find(i => i.label === label);
        setCurrentTime([
            start_time(),
            end_time
        ]);
    }

    function handleTimeChange(time) {
        setCurrentTime(time);
    }

    function renderBtnGroup() {
        return btn_list.map(({ label }) => (
            <Button
                size="small"
                type="primary"
                onClick={handleTimeBtnClick.bind(null, label)}
                key={label}
                className={styled["time-footer-btn"]}
            >{label}</Button>
        ));
    }

    function handleOk() {
        flushFn();
        closeFn();
    }

    return (
        <>
            <Button onClick={showFn} type="primary">设置时间范围</Button>
            <Modal
                visible={status}
                onCancel={closeFn}
                title="设置时间范围"
                okText="确定"
                okButtonProps={{
                    type: "primary"
                }}
                onOk={handleOk}
                width={400}
            >
                <RangePicker
                    allowClear={false}
                    value={value}
                    onChange={handleTimeChange}
                    showTime={{
                        defaultValue: [
                            moment("00:00:00", "HH:mm:ss"),
                            moment("23:59:59", "HH:mm:ss")
                        ]
                    }}
                    renderExtraFooter={renderBtnGroup}
                />
            </Modal>
        </>
    );
}

function createInitTime() {
    // 初始时间值，今天00:00至23:59
    const start_time = moment().startOf("day");
    const end_time = moment().endOf("day");
    return [start_time, end_time];
}

function convertTimeToTimeStamp(list) {
    // 将moment时间值转换为时间戳

    return list.map(time => time.format("x"));
}

export function useTime(initTime = createInitTime()) {
    const [currentTime, setCurrentTime] = useState(initTime);
    // 当前选择的时间范围

    const [modalStatus, setModalStatus] = useState(false);
    // modal的状态

    const [timeStamp, setTimeStamp] = useState(convertTimeToTimeStamp(currentTime));
    // 当前选择的时间戳

    function closeModal() {
        setModalStatus(false);
    }

    function showModal() {
        setModalStatus(true);
    }

    function flushTimestamp() {
        // 刷新时间戳

        setTimeStamp(convertTimeToTimeStamp(currentTime));
    }

    const BaseModal = (
        <TimeModal
            value={currentTime}
            status={modalStatus}
            setCurrentTime={setCurrentTime}
            closeFn={closeModal}
            showFn={showModal}
            flushFn={flushTimestamp}
        />
    );

    return [BaseModal, timeStamp];
}