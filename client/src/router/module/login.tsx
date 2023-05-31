import { createLazyComp, Route } from "@/router/utils";

const routes: Route = {
    path: "/login",
    element: createLazyComp(() => import("@/pages/users/login")),
    meta: {
        auth: false
    },
    navConfig: {
        labelKey: "login",
        showSideNav: false
    }
};

export default routes;