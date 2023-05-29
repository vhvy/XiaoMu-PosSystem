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
        title: "首页",
        auth: true
    }
};

export default routes;