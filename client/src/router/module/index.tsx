import { Route } from "@/router/utils";
import { Navigate } from "react-router-dom";

const modules = import.meta.glob("./*.tsx", {
    eager: true,
    import: "default"
});

const routes = Object.values(modules) as Route[];

const defaultRoute: Route = {
    path: "*",
    element: <Navigate replace to="/login" />
};

export default [
    ...routes,
    defaultRoute
];