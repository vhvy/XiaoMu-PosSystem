import { createLazyComp, Route } from "@/router/utils";

const routes: Route = {
    path: "/login",
    element: createLazyComp(() => import("@/pages/users/login")),
    meta: {
        title: "登录",
        auth: false
    }
};

export default routes;