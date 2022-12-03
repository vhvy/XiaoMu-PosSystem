import { createLazyComp, Route } from "@/router/utils";

const routes: Route = {
    path: "/",
    index: true,
    element: createLazyComp(() => import("@/pages/home/index")),
    meta: {
        title: "首页",
        auth: true
    }
};

export default routes;