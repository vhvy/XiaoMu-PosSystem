import { createLazyComp, Route } from "@/router/utils";

const routes: Route = {
    path: "/",
    element: createLazyComp(() => import("@/pages/home/index")),
    meta: {
        title: "首页",
        auth: false
    }
};

export default routes;