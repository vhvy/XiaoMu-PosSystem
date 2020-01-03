import { Login } from "../views/Login";
import Home from "../views/Home";

export const routes = [
    {
        path: "/home",
        component: Home,
        isPrivate: true,
        exact: false
    },
    {
        path: "/login",
        component: Login
    }
];