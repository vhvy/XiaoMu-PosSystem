import React from "react";
import ReactDom from "react-dom/client";
import App from "@/App";

ReactDom
    .createRoot(document.querySelector("#root") as HTMLElement)
    .render((
        <React.StrictMode>
            <App />
        </React.StrictMode>
    ));