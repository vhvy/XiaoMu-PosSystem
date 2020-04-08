import { useState, useEffect } from "react";

export function usePosprint() {

    const [posPrintList, setPosPrintList] = useState([]);

    async function getPosPrintList() {
        // 待以后补齐相关代码，使用electron提供的node api获取本地打印机列表

        const fakePrintList = [
            {
                name: "POS58"
            },
            {
                name: "TPA42"
            }
        ];

        setPosPrintList(fakePrintList);
    }

    useEffect(() => {
        getPosPrintList();
    }, []);

    return posPrintList;
}