interface Locale {
    AppName: string,
    Common: {
        okText: string,
        saveBtnText: string,
        cancelBtnText: string,
        promptTitle: string
    },
    Pagination: {
        prevPageTip: string,
        nextPageTip: string,
        previous$Pages: string,
        next$Pages: string,
        limit$Option: string
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
        login: string,
        home: string,
        product: string,
        sales: string,
        productCategory: string,
        productList: string,
        salesOrder: string,
        user: string
    },
    NavUserMenu: {
        signOut: string,
        accountInfo: string,
        signOutDialogContent: string,
        signOutSuccessPrompt: string
    }
}