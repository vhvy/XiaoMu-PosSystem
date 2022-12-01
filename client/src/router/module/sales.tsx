import { createLazyComp, Route } from "@/router/utils";
import { Navigate } from "react-router-dom";
import BaseLayout from "@/components/BaseLayout/index";

const routes: Route = {
    path: "/sales/*",
    element: <BaseLayout />,
    meta: {
        title: "销售",
        auth: false
    },
    children: [
        {
            path: "order",
            index: true,
            element: createLazyComp(() => import("@/pages/sales/order")),
        },
        {
            path: "*",
            element: <Navigate replace to="category" />
        }
    ]
};

export default routes;