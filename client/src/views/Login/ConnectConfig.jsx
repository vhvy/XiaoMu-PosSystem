import React, { useState } from "react";
import { Form, Input, Button, Icon, Modal } from "antd";
import { connect } from "react-redux";
import { config } from "../../config";
import { setApiUrlAction } from "../../redux/action";
import { setConnectConfig } from "../../tasks/setConnectConfig";

const { baseURL } = config;


function _ConfigForm({ form }) {
    const { getFieldDecorator } = form;
    return (
        <Form>
            <Form.Item
                extra="格式为 http(s)://localhost.local:port"
            >
                {
                    getFieldDecorator(
                        "apiUrl",
                        {
                            rules: [
                                {
                                    pattern: /^\S*$/g,
                                    message: "地址中不能有空格!"
                                }
                            ]
                        }
                    )(
                        <Input
                            placeholder={`请输入服务器地址，默认为${baseURL}`}
                            type="text"
                            prefix={<Icon type="api" style={{ color: "rgba(0,0,0,.25)" }} />}
                        />
                    )
                }
            </Form.Item>
        </Form>
    );
}

function ConfigFormMapStateToProps(state) {
    const { apiUrl } = state;
    return {
        apiUrl
    };
}

function mapPropsToFields({ apiUrl }) {
    const { url, errors } = apiUrl;
    return {
        apiUrl: Form.createFormField({
            value: url,
            errors
        })
    };
}

function onFieldsChange({ dispatch }, changedFields) {
    const { value, errors } = changedFields.apiUrl;
    dispatch(setApiUrlAction({
        url: value,
        errors,
    }));
}

const ConfigForm = connect(ConfigFormMapStateToProps)(Form.create({
    mapPropsToFields,
    onFieldsChange
})(_ConfigForm));



function _ConnectConfig({ url, errors }) {
    const [modalVisible, setModalVisible] = useState(false);

    function showModal() {
        setModalVisible(true);
    }

    function hideModal() {
        setModalVisible(false);
    }

    function saveConnectConfig() {
        hideModal();
        setConnectConfig(url);
    }

    return (
        <>
            <Button type="link" onClick={showModal}>连接设置</Button>
            <Modal
                centered
                destroyOnClose
                title="连接设置"
                visible={modalVisible}
                closable={false}
                onCancel={hideModal}
                onOk={saveConnectConfig}
                okButtonProps={{
                    disabled: errors ? true : false
                }}
                okText="保存"
            >
                <ConfigForm />
            </Modal>
        </>
    );
}

function ConnectConfigMapStateToProps({ apiUrl }) {
    const { url, errors } = apiUrl;
    return {
        url,
        errors
    };
}

export const ConnectConfig = connect(ConnectConfigMapStateToProps)(_ConnectConfig);
