import { Home24Regular } from "@fluentui/react-icons";

import { createLazyComp, Route } from "@/router/utils";
import BaseLayout from "@/components/BaseLayout/index";


const routes: Route = {
    path: "/",
    index: true,
    element: (
        <BaseLayout>
            {createLazyComp(() => import("@/pages/home/index"))}
        </BaseLayout>
    ),
    meta: {
        auth: true
    },
    navConfig: {
        labelKey: "home",
        icon: <Home24Regular />,
        sort: 0
    }
};

export default routes;