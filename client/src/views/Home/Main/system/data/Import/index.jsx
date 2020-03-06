import React, { useState, useMemo } from "react";
import styled from "../../../../../../styles/data/import.scss";
import { Steps, Button } from "antd";
import { UploadFile } from "./UploadFile";
import { FieldsConfig } from "./FieldsConfig";
import { UploadToServer } from "./UploadToServer";
import { OtherConfig } from "./OtherConfig";
import copyObj from "../../../../../../tools/copyObj";

const { Step } = Steps;

export function DataImport() {

    const initFileStatus = {
        status: false,
        config: {}
    };

    const [uploadStatus, setUploadStatus] = useState("wait");
    /**
     * 上传状态 wait uploading done
     */

    const [fileStatus, setFileStatus] = useState(initFileStatus);
    // 经过处理的原始数据

    const [importData, setImportData] = useState(null);

    const [mapValueList, setMapValueList] = useState([]);
    // 映射规则列表

    function convertToString(s) {
        // xlsl导入后某些属性是数字而不是字符串，所以进行一次转换

        return (typeof s === "string") ? s : s + "";
    }

    const typeConfig = [
        {
            type: "商品导入",
            fields: [
                {
                    field: "barcode",
                    label: "商品条码",
                    convertFn: convertToString
                },
                {
                    field: "name",
                    label: "商品名称",
                    required: true,
                    convertFn: convertToString
                },
                {
                    field: "category_name",
                    label: "商品分类",
                    required: true,
                    map: true,
                    convertFn: convertToString
                },
                {
                    field: "in_price",
                    label: "商品进价"
                },
                {
                    field: "sale_price",
                    label: "商品售价"
                },
                {
                    field: "unit",
                    label: "单位",
                    convertFn: convertToString
                },
                {
                    field: "size",
                    label: "规格",
                    convertFn: convertToString
                },
                {
                    field: "is_delete",
                    label: "禁用",
                    map: true
                },
                {
                    field: "vip_points",
                    label: "是否积分",
                    map: true
                },
                {
                    field: "supplier_name",
                    label: "供应商",
                    convertFn: convertToString
                }
            ],
            rules: [
                {
                    id: "barcode_exist",
                    label: "当商品条码存在时",
                    option: [
                        {
                            value: true,
                            label: "更新商品信息"
                        },
                        {
                            value: false,
                            label: "跳过此商品"
                        }
                    ]
                },
                {
                    id: "category_exist",
                    label: "当商品分类不存在时",
                    option: [
                        {
                            value: true,
                            label: "创建新分类"
                        },
                        {
                            value: false,
                            label: "跳过此商品"
                        }
                    ]
                },
                {
                    id: "supplier_exist",
                    label: "当供应商不存在时",
                    option: [
                        {
                            value: true,
                            label: "创建新供应商"
                        },
                        {
                            value: false,
                            label: "使用默认供应商"
                        }
                    ]
                }
            ]
        },
        // {
        //     type: "会员导入",
        //     fields: [

        //     ],
        //     rules: []
        // }
    ];



    const [fileList, setFileList] = useState([]);
    // 上传的文件列表

    const [data, setData] = useState([]);
    // 上传的数据列表

    const initOption = {
        import_type: {
            name: "import_type",
            value: typeConfig[0].type
        },
        barcode_exist: {
            name: "barcode_exist",
            value: false
        },
        category_exist: {
            name: "category_exist",
            value: true
        },
        supplier_exist: {
            name: "supplier_exist",
            value: false
        }
    };
    // 初始默认值

    const [option, setOption] = useState(initOption);
    // 所有配置项

    const { currentTypeConfig, mapFields } = useMemo(() => {
        const currentTypeConfig = typeConfig.find(i => i.type === option["import_type"].value);

        const mapFields = currentTypeConfig.fields
            .filter(({ map = false }) => map);

        return {
            currentTypeConfig,
            mapFields
        };
    }, [option["import_type"].value]);



    function checkOption() {
        // 检查配置项

        const need_fields = currentTypeConfig.fields
            .filter(({ required = false }) => required)
            .map(({ field }) => field);
        // 不能省略的字段 


        for (let key of need_fields) {
            if (!option[key] || !option[key].value || option[key].errors) return true;
        }

        return false;
    }

    function formatData() {
        // 按照字段设置将原始数据映射为需要的数据格式

        const { rules, fields } = currentTypeConfig;

        const base_fields = {};
        // 所有和表头对应的字段名

        const base_fields_convert = {};
        // 字段对应的处理钩子函数

        const config = {
            rules: {},
            data: []
        };

        for (let { id } of rules) {
            config.rules[id] = option[id].value;
            // 将转换规则写入规则表
        }

        for (let { field, convertFn } of fields) {
            option[field] && option[field].value && (base_fields[field] = option[field].value) && convertFn && (base_fields_convert[field] = convertFn);
        }

        const keys = Object.keys(base_fields);

        config.data = data.map(item => {
            let vl = {};
            keys.forEach(key => {
                // key 和表头对应的属性名

                const value = item[base_fields[key]];
                // 上传的xlsx文件的属性值

                const convertFn = base_fields_convert[key];

                (value !== undefined && value !== null) && (vl[key] = convertFn ? convertFn(value) : value);
            });
            return vl;
        });

        setFileStatus({
            status: true,
            config
        });
    }

    function mapConfigToData() {
        // 按照属性值的映射规则对data进行处理

        const { config, status } = fileStatus;
        if (!status) return;

        if (mapValueList.length === 0) {
            setImportData(config);
        } else {
            const { data, ...args } = config;

            /**
             * 本来打算做个映射的map值的，后来又担心来个奇葩key值，还是用循环吧
             */

            const result = data.map(i => {
                const copy_i = copyObj(i);
                mapValueList.forEach(({ field, values }) => {
                    const value = copy_i[field];
                    if (value !== undefined || value !== null) {
                        const item = values.find(i => i.value === value);
                        // 查找出新旧键值对

                        item && (copy_i[field] = item.new_value);
                        // 当键值对存在时修改对象值为新值
                    }
                });

                return copy_i;
            });

            setImportData({
                ...args,
                data: result
            });
        }
    }

    function done() {
        // 清理所有数据

        setUploadStatus("wait");
        setFileStatus(initFileStatus);
        setImportData(null);
        setMapValueList([]);
        setData([]);
        setFileList([]);
        setOption(initOption);
        setCurrentStep(0);
    }

    const stepConfig = [
        {
            title: "上传文件",
            content: (
                <UploadFile
                    fileList={fileList}
                    setFileList={setFileList}
                    setData={setData}
                />
            ),
            btnDisabled: {
                "下一步": fileList.length === 0
            }
        },
        {
            title: "字段设置",
            content: (
                <FieldsConfig
                    data={data}
                    option={option}
                    setOption={setOption}
                    typeConfig={typeConfig}
                />
            ),
            btnDisabled: {
                "下一步": fileList.length === 0 || checkOption()
            },
            prevHook: () => {
                setOption(initOption);
            },
            nextHook: formatData
        },
        {
            title: "其他设置",
            content: (
                <OtherConfig
                    setFileStatus={setFileStatus}
                    option={option}
                    data={data}
                    mapValueList={mapValueList}
                    setMapValueList={setMapValueList}
                    fileStatus
                    mapFields={mapFields}
                    {...currentTypeConfig}
                    {...fileStatus}
                />
            ),
            btnDisabled: {
                "下一步": !fileStatus.status
            },
            prevHook: () => {
                setFileStatus(initFileStatus);
                setMapValueList([]);
            },
            nextHook: mapConfigToData
        },
        {
            title: "导入数据",
            content: (
                <UploadToServer
                    importData={importData}
                    uploadStatus={uploadStatus}
                    setUploadStatus={setUploadStatus}
                    doneFn={done}
                />
            ),
            btnDisabled: {
                "上一步": uploadStatus === "uploading" || uploadStatus === "done"
            },
            prevHook: () => {
                setImportData(null);
                setUploadStatus("wait");
                // 将数据恢复原始值
            }
        }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    // 当前步骤

    const { content, btnDisabled } = stepConfig[currentStep];

    function next() {
        setCurrentStep(i => i + 1);

        const { nextHook } = stepConfig[currentStep];
        nextHook && nextHook();
    }

    function prev() {
        setCurrentStep(i => i - 1);

        const { prevHook } = stepConfig[currentStep];
        prevHook && prevHook();
    }

    const baseBtnList = [
        {
            title: "下一步",
            disabled: btnDisabled["下一步"],
            show: currentStep !== stepConfig.length - 1,
            fn: next
        },
        {
            title: "上一步",
            disabled: btnDisabled["上一步"],
            type: "",
            show: (currentStep === 3 && (uploadStatus === "wait" || uploadStatus === "error")) || (currentStep !== 0 && currentStep !== 3),
            fn: prev
        }
    ];

    const btnList = baseBtnList.filter(({ show }) => show);

    return (
        <div
            className={styled["data-import-wrapper"]}
        >
            <Steps
                current={currentStep}
            >
                {
                    stepConfig.map(({ title }) => (
                        <Step key={title} title={title} />
                    ))
                }
            </Steps>
            <div className={styled["steps-body"]}>
                {
                    content
                }
            </div>
            <div className={styled["steps-btn-wrap"]}>
                {
                    btnList.map(({ title, disabled, type = "primary", fn }) => (
                        <Button
                            key={title}
                            disabled={disabled}
                            type={type}
                            onClick={fn}
                        >
                            {title}
                        </Button>
                    ))
                }
            </div>
        </div>
    );
}