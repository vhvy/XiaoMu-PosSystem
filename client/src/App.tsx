import {
    RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import "@/styles/reset.scss";
import "@/styles/main.scss";

import router from "@/router/index";
import store from "@/store/index";
import AuthProvider from "@/provider/AuthProvider";
import LocaleProvider from "@/provider/LocaleProvider";
import Notice from "@/components/Notice/index";
import XMDialog from "@/components/XMDialog";

import useMsg from "@/hooks/useMsg";

const App = () => {

    const msg = useMsg();

    const handleSWRError = (err: Error) => {
        msg.error(err.message);
    }

    const swrConfig = {
        onError: handleSWRError
    };

    return (
        <Provider store={store}>
            <FluentProvider theme={webLightTheme}>
                <LocaleProvider>
                    <Notice />
                    <XMDialog />
                    <SWRConfig value={swrConfig}>
                        <AuthProvider>
                            <RouterProvider router={router} />
                        </AuthProvider>
                    </SWRConfig>
                </LocaleProvider>
            </FluentProvider>
        </Provider>
    );
}

export default App;