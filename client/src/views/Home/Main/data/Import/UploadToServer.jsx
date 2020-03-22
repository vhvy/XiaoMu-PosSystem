import React, { useState, useMemo } from "react";
import styled from "../../../../../styles/data/import.scss";
import { Button, Icon, Spin, Result } from "antd";
import { useAjax } from "../../../../AjaxProvider";
import { DataManage } from "../../../../../tasks/data";

export function UploadToServer({
    importData,
    uploadStatus,
    setUploadStatus,
    doneFn
}) {

    const ajax = useAjax();

    const [resultData, setResultData] = useState({
        create_count: 0,
        update_count: 0,
        skip_count: 0
    });
    async function handleUpload() {
        setUploadStatus("uploading");

        try {
            const { data } = await DataManage.importCommodity(ajax, importData);

            setResultData(data);
            setUploadStatus("done");
        } catch (error) {
            console.log(error);
            setUploadStatus("error");
        }
    }


    const config = [
        {
            status: "wait",
            component: (
                <Button
                    size="large"
                    type="primary"
                    disabled={!importData}
                    onClick={handleUpload}
                >
                    <Icon type="cloud-upload" />
                    开始导入
                </Button>
            )
        },
        {
            status: "uploading",
            component: (
                <Spin
                    tip="正在导入数据，请稍候..."
                    size="large"
                    indicator={
                        <Icon type="loading" style={{ fontSize: 48 }} spin />
                    }
                />
            )
        },
        {
            status: "error",
            component: (
                <Result
                    title="导入商品数据失败"
                    status="error"
                    subTitle="请检查导入数据后重新导入"
                    extra={[
                        <Button
                            type="primary"
                            key="done"
                            onClick={handleUpload}
                        >
                            重试
                        </Button>
                    ]}
                />
            )
        },
        {
            status: "done",
            component: (
                <Result
                    title="商品数据导入成功"
                    status="success"
                    subTitle={`共上传${importData.data && importData.data.length || 0}条数据, 创建${resultData.create_count}条数据, 更新${resultData.update_count}条数据, 跳过${resultData.skip_count}条数据。`}
                    extra={[
                        <Button
                            type="primary"
                            key="done"
                            onClick={doneFn}
                        >
                            继续导入
                        </Button>
                    ]}
                >

                </Result>
            )
        }
    ];

    const { component } = useMemo(() => config.find(i => i.status === uploadStatus), [uploadStatus]);

    return (
        <div
            className={styled["upload-toserver-wrap"]}
        >
            {
                component
            }
        </div>
    );
}