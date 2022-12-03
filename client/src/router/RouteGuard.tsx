import React, { ReactElement } from "react";
import { RouteMeta } from "@/router/utils";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";


type Props = {
    meta: RouteMeta,
    children: ReactElement
}

export const RouteGuard: React.FC<Props> = ({ children, meta }: Props) => {
    const { isLogin } = useAuth();
    
    if (meta?.auth && !isLogin) {
        return <Navigate to="/login" />;
    }

    if (meta?.title) {
        document.title = meta.title;
    }

    return children;
};