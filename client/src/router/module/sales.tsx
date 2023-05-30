import { Navigate } from "react-router-dom";
import { Box24Regular } from "@fluentui/react-icons";

import { createLazyComp, Route } from "@/router/utils";
import BaseLayout from "@/components/BaseLayout/index";

const routes: Route = {
    path: "/sales/*",
    element: <BaseLayout />,
    meta: {
        auth: true
    },
    navConfig: {
        labelKey: "sales",
        icon: <Box24Regular />,
        sort: 10
    },
    children: [
        {
            path: "order",
            index: true,
            element: createLazyComp(() => import("@/pages/sales/order")),
            navConfig: {
                labelKey: "salesOrder"
            }
        },
        {
            path: "*",
            element: <Navigate replace to="order" />
        }
    ]
};

export default routes;