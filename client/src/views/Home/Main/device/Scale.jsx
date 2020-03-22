import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Progress, message } from "antd";
import { useAjax } from "../../../AjaxProvider";
import { useCategories } from "../../../../hooks/useCategories";
import { ScaleList, } from "../../../../device/scale";
import { CommodityTasks } from "../../../../tasks/commodity";

const { Option } = Select;

export const Scale = Form.create()(_Scale);

function _Scale({
    form
}) {

    const ajax = useAjax();

    const [categories] = useCategories({ ajax });

    const { getFieldDecorator, getFieldsError, getFieldsValue, getFieldValue, isFieldsTouched, setFieldsValue } = form;

    const scaleName = getFieldValue("scale");

    useEffect(() => {
        if (isFieldsTouched()) {
            // 组件第一次挂载时不执行此操作
            // 切换电子秤时切换相应IP和端口

            const { port, host } = ScaleList.find(i => i.name === scaleName);
            setFieldsValue({
                ip: host,
                port
            });
        }
    }, [scaleName]);

    const hasError = (() => {
        if (!isFieldsTouched()) return true;

        const errors = getFieldsError();

        for (let key of Object.keys(errors)) {
            if (errors[key]) return true;
        }

        if (!getFieldValue("category")) return true;

        return false;
    })();

    const config = [
        {
            id: "scale",
            label: "电子秤",
            initialValue: ScaleList[0].name,
            component: (
                <Select>
                    {
                        ScaleList.map(({ name }) => <Option value={name} key={name}>{name}</Option>)
                    }
                </Select>
            ),
            rules: [
                {
                    required: true,
                    message: "必须选择电子秤!"
                }
            ]
        },
        {
            id: "ip",
            label: "IP",
            initialValue: ScaleList[0].host,
            component: (
                <Input placeholder="请输入IP地址" />
            ),
            rules: [
                {
                    required: true,
                    message: "必须输入IP地址!"
                },
                {
                    pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    message: "IP地址格式不正确!"
                }
            ]
        },
        {
            id: "port",
            label: "端口",
            initialValue: ScaleList[0].port,
            component: (
                <InputNumber
                    placeholder="请输入端口号"
                    min={1}
                    max={65535}
                    formatter={v => {
                        if (typeof v === "number" || Number.isNaN(Number(v))) return v;
                        return Math.floor(Number(v));
                    }}
                />
            ),
            rules: [
                {
                    required: true,
                    message: "必须输入端口号!"
                }
            ]
        },
        {
            id: "category",
            label: "商品分类",
            component: (
                <Select>
                    {
                        categories.map(({ name }) => <Option value={name} key={name}>{name}</Option>)
                    }
                </Select>
            ),
            rules: [
                {
                    required: true,
                    message: "必须选择商品分类!"
                }
            ]
        }
    ];

    const formLayout = {
        wrapperCol: {
            span: 15
        },
        labelCol: {
            span: 6
        }
    }

    const initProgressData = {
        show: false,
        percent: 0,
        text: ""
    }

    const [progressData, setProgressData] = useState(initProgressData);

    function mapData(data) {
        let PLU_DATA = [];

        function fillingToFiveBit(n) {
            let str = n;
            if (str.length < 5) {
                while (str.length !== 5) {
                    str = "0" + str;
                }
            } else if (str.length > 5) {
                // 目前来说只能支持到99999种商品
                // 所以一般不会跑到这里来
                while (str.length !== 5) {
                    str = str.slice(1);
                }
            }
            return str;
        }

        for (let i = 0, len = data.length; i < len; i++) {
            const { id, name, sale_price } = data[i];


            PLU_DATA.push({
                plu_code: i + 1,
                code: `22${fillingToFiveBit(id + "")}`,
                unit_price: sale_price,
                name
            });
        }

        return PLU_DATA;
    }

    async function handleUpdatePLU() {
        setProgressData(s => ({
            ...s,
            show: true,
            text: "正在获取商品信息..."
        }));

        const values = getFieldsValue();

        const { scale, ip, port, category } = values;

        let len = 0;
        // plu数据数组长度

        function onItemEnd(pos) {

            const percent = Math.floor(pos / len * 100);
            // 进度百分比

            setProgressData(s => ({
                ...s,
                text: `商品PLU传输进度: ${pos}/${len}`,
                percent
            }));
        }

        function onError(error) {
            message.error(error.message);

            setProgressData(initProgressData);
        }

        function onEnd() {
            setProgressData(initProgressData);
            message.success("商品PLU更新完毕!");
        }

        try {
            const { data } = await CommodityTasks.queryByCategory(ajax, [category]);

            const plu_data = mapData(data);

            setProgressData(s => ({
                ...s,
                text: "商品获取完成!"
            }));

            const { ScaleClass } = ScaleList.find(i => i.name === scale);

            const ScaleInstance = new ScaleClass(ip, port);

            len = plu_data.length;


            await ScaleInstance.sendPlu({
                data: plu_data,
                onItemEnd,
                onEnd,
                onError
            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form
            {...formLayout}
        >
            {
                config.map(({ id, label, component, initialValue, rules }) => (
                    <Form.Item label={label} key={id}>
                        {
                            getFieldDecorator(id, {
                                initialValue,
                                rules
                            })(component)
                        }
                    </Form.Item>
                ))
            }
            <Form.Item label=" " colon={false}>
                <Button
                    disabled={hasError}
                    onClick={handleUpdatePLU}
                    type="primary"
                    loading={progressData.show}
                >
                    更新
                </Button>
            </Form.Item>

            <Progress percent={progressData.percent} status="active" style={!progressData.show ? { zIndex: -1 } : {}} />
            {progressData.text}
        </Form>
    );
}