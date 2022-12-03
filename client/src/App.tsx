import "@/styles/reset.scss";
import {
    RouterProvider,
} from "react-router-dom";
import router from "@/router/index";
import store from "@/store/index";
import { Provider } from "react-redux";
import AuthProvider from "@/provider/AuthProvider";

const App = () => {

    return (
        <Provider store={store}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </Provider>
    );
}

export default App;