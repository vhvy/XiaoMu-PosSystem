import React, { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { RouteMeta } from "@/router/utils";
import useAuth from "@/hooks/useAuth";


type Props = {
    meta: RouteMeta,
    children: ReactElement
}

const getRedirectPath = (from: string) => {
    return "/login?from=" + encodeURIComponent(from);
}

export const RouteGuard: React.FC<Props> = ({ children, meta }: Props) => {
    const location = useLocation();
    const { isLogin } = useAuth();
    
    if (meta?.auth && !isLogin) {
        return <Navigate to={getRedirectPath(location.pathname + location.search)} />;
    }

    if (meta?.title) {
        document.title = meta.title;
    }

    return children;
};