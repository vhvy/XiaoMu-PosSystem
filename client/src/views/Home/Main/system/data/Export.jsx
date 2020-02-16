import React from "react";
import styled from "../../../../../styles/data/export.scss";
import { Upload, message, Button, Icon, Card } from "antd";
import * as XLSX from "xlsx";

export function DataExport() {

    const config = [
        {
            title: "商品导出"
        },
        {
            title: "会员导出"
        },
        {
            title: "销售数据导出"
        }
    ];



    
    return (
        <div className={styled["data-wrapper"]}>
            {/* <Upload
                accept=".xlsx, .xls"
                beforeUpload={handleUpload}
            >
                <Button>
                    <Icon type="upload" /> Click to Upload
                </Button>
            </Upload> */}


            <Card title="数据导出">
                {
                    config.map(({ title, fn = () => { } }) => (
                        <Card.Grid key={title} onClick={fn}>{title}</Card.Grid>
                    ))
                }
            </Card>


        </div>
    )
}