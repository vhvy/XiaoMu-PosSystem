interface Locale {
    AppName: string,
    Common: {
        okText: string,
        saveBtnText: string,
        cancelBtnText: string
    },
    Login: {
        loginTitle: string,
        accountPlaceholder: string,
        passwordPlaceholder: string,
        loginConfirmBtn: string,
        advancedSettingsBarText: string,
        forgetPasswordText: string,
        settingsTitle: string,
        backToLoginPanelBtnText: string,
        accountValidate: {
            invalidMsg: string,
            lengthLimit: string
        },
        passwordValidate: {
            invalidMsg: string,
            lengthLimit: string
        },
        Settings: {
            serverAddress: string,
            addressExample: string
        }
    },
    NavLabel: {
        home: string,
        product: string,
        sales: string,
        productCategory: string,
        productList: string,
        salesOrder: string
    }
}