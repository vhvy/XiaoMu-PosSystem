import React, { useState, useMemo } from "react";
import styled from "../../../../../../styles/data/export.scss";
import { Steps, Icon, Button } from "antd";
import * as XLSX from "xlsx";
import { ExportFile } from "./ExportFile";
import { TypeConfig } from "./TypeConfig";
import { useAjax } from "../../../../../AjaxProvider";
import { DataManage } from "../../../../../../tasks/data";

const { Step } = Steps;

function exportXlsxFile(ALL_DATA, name = "数据") {
    // 导出xlxs文件

    const wb = XLSX.utils.book_new();
    // 新文档

    for (let { name, data } of ALL_DATA) {
        const ws = XLSX.utils.json_to_sheet(data);
        // 文档内容

        XLSX.utils.book_append_sheet(wb, ws, name);
    }

    XLSX.writeFile(wb, `${name}.xlsx`);
}

function exportJsonFile(content, name = "数据") {
    // 导出json文件

    const ele = document.createElement("a");
    ele.download = `${name}.json`;
    ele.style.display = "none";

    const blob = new Blob([JSON.stringify(content)]);
    // 转为二进制数据块

    ele.href = URL.createObjectURL(blob);
    // 修改a标签url指向

    document.body.appendChild(ele);
    // 加入body

    ele.click();
    // 触发下载

    document.body.removeChild(ele);
    // 删除此dom
}

export function DataExport() {

    const ajax = useAjax();

    const dataTypeConfig = [
        {
            title: "商品数据",
            type: "commodity"
        },
        {
            title: "会员数据",
            type: "vip"
        },
        {
            title: "销售数据",
            type: "sales"
        }
    ];
    // 导出的数据类型

    const fileTypeConfig = [
        {
            title: "XLSX",
            fn: exportXlsxFile
        },
        {
            title: "JSON",
            fn: exportJsonFile
        }
    ];
    // 导出数据的文件格式

    const initTypeState = {
        dataType: dataTypeConfig[0].title,
        fileType: fileTypeConfig[0].title
    };

    const [typeConfig, setType] = useState(initTypeState);
    // 导出数据类型


    const [exportStatus, setExportStatus] = useState("ready");
    // 设置当前导出状态

    const stepConfig = [
        {
            title: "类型设置",
            icon: "control",
            content: useMemo(() => (
                <TypeConfig
                    setType={setType}
                    dataTypeList={dataTypeConfig.map(i => i.title)}
                    fileTypeList={fileTypeConfig.map(i => i.title)}
                    {...typeConfig}
                />), [typeConfig])
        },
        {
            title: "导出数据",
            icon: "file-excel",
            prevHook: () => setExportStatus("ready"),
            content: useMemo(() => (
                <ExportFile
                    startExport={startExport}
                    status={exportStatus}
                    dataType={typeConfig.dataType}
                    reset={reset}
                />), [exportStatus, typeConfig])
        }
    ];

    async function startExport() {
        setExportStatus("downloading");

        const { dataType, fileType } = typeConfig;

        const { type } = dataTypeConfig.find(i => i.title === dataType);

        try {
            const { data } = await DataManage.exportData(ajax, type);

            const { fn } = fileTypeConfig.find(i => i.title === fileType);
            fn(data, dataType);

            setExportStatus("done");
        } catch (error) {
            console.log(error);
            setExportStatus("failed");
        }
    }

    function reset() {
        // 继续导入

        setStep(0);
        setType(initTypeState);
        setExportStatus("ready");
    }

    const [curretStep, setStep] = useState(0);
    // 步骤进度设置

    const btnList = [
        {
            title: "下一步",
            fn: next,
            show: curretStep !== stepConfig.length - 1
        },
        {
            title: "上一步",
            fn: prev,
            show: curretStep !== 0 && exportStatus !== "downloading" && exportStatus !== "done"
        }
    ];

    const { content, prevHook } = stepConfig[curretStep];

    function next() {
        curretStep < stepConfig.length - 1 && setStep(s => s + 1);
    }

    function prev() {
        curretStep !== 0 && setStep(s => s - 1);
        prevHook && prevHook();
    }

    return (
        <div className={styled["data-wrapper"]}>
            <Steps current={curretStep}>
                {
                    stepConfig.map(({ title, icon }) => (
                        <Step key={title} title={title} icon={<Icon type={icon} />} />)
                    )
                }
            </Steps>
            <div className={styled["data-content-wrap"]}>
                {content}
            </div>
            <div className={styled["data-footer-wrap"]}>
                {
                    btnList.filter(i => i.show).map(
                        ({ title, fn, type = "primary", disabled = false }) => (
                            <Button disabled={disabled} onClick={fn} key={title} type={type}>{title}</Button>
                        )
                    )
                }
            </div>
        </div>
    )
}