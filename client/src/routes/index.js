import { Login } from "../views/Login";
import Home from "../views/Home";

export const routes = [
    {
        path: "/home",
        component: Home,
        isPrivate: true
    },
    {
        path: "/login",
        component: Login
    }
];