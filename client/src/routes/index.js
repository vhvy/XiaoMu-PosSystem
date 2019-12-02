import { Login } from "../components/common/Login";
import Home from "../components/common/Home";

export const routes = [
    {
        path: "/",
        component: Home,
        isPrivate: true
    },
    {
        path: "/login",
        component: Login
    }
];