import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Route, RouteMeta } from "@/router/utils";
import { ReactElement, } from "react";
import { RouteGuard } from "@/router/RouteGuard";
import routes from "@/router/module/index";


const createComponent = (element: ReactElement, meta: RouteMeta) => {
    return (
        <RouteGuard meta={meta}>
            {element}
        </RouteGuard>
    );
}


const createRoutes = (routes: Route[]): RouteObject[] => {

    return routes.map(({ path, element, meta, children }) => {
        const route: RouteObject = {
            path,
            element: createComponent(element, meta),
        };

        if (children && children.length) {
            route.children = createRoutes(children);
        }

        return route;
    });
}


const config = createRoutes(routes);

const router = createBrowserRouter(config);

export default router;