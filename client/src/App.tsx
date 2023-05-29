import {
    RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import "@/styles/reset.scss";
import "@/styles/main.scss";

import router from "@/router/index";
import store from "@/store/index";
import AuthProvider from "@/provider/AuthProvider";
import LocaleProvider from "@/provider/LocaleProvider";
import Notice from "@/components/Notice/index";

const App = () => {

    return (
        <Provider store={store}>
            <FluentProvider theme={webLightTheme}>
                <LocaleProvider>
                    <Notice />
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                </LocaleProvider>
            </FluentProvider>
        </Provider>
    );
}

export default App;