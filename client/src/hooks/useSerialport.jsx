import { useState, useEffect } from "react";

export function useSerialport() {

    const [serialPort, setSerialPortList] = useState([]);

    async function getComportList() {
        // 获取串口列表

        const fakeComportList = [
            {
                port: "COM1",
            },
            {
                port: "COM2"
            },
            {
                port: "COM3"
            }
        ];

        setSerialPortList(fakeComportList);
    }

    useEffect(() => {
        getComportList();
    }, []);

    return serialPort;

}