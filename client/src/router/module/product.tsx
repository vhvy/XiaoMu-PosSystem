import { Navigate } from "react-router-dom";
import { Apps24Regular } from "@fluentui/react-icons";

import { createLazyComp, Route } from "@/router/utils";
import BaseLayout from "@/components/BaseLayout/index";

const routes: Route = {
    path: "/product/*",
    element: <BaseLayout />,
    meta: {
        auth: true
    },
    navConfig: {
        labelKey: "product",
        icon: <Apps24Regular />,
        sort: 20
    },
    children: [
        {
            path: "category",
            index: true,
            element: createLazyComp(() => import("@/pages/product/category")),
            meta: {
                title: "产品-分类"
            }
        },
        {
            path: "*",
            element: <Navigate replace to="category" />
        }
    ]
};

export default routes;