import React from "react";
import ReactDom from "react-dom/client";

import { initDefaultLocale } from "@/i18n/locales";
import App from "@/App";

await initDefaultLocale();

ReactDom
    .createRoot(document.querySelector("#root") as HTMLElement)
    .render((
        <React.StrictMode>
            <App />
        </React.StrictMode>
    ));