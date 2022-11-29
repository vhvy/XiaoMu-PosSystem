import { createLazyComp, Route } from "@/router/utils";

const routes: Route = {
    path: "/product",
    element: createLazyComp(() => import("@/pages/product/index")),
    meta: {
        title: "产品",
        auth: false
    }
};

export default routes;