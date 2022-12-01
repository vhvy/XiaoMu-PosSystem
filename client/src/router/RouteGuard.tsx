import React, { ReactElement } from "react";
import { RouteMeta } from "@/router/utils";
import { Navigate } from "react-router-dom";


type Props = {
    meta: RouteMeta,
    children: ReactElement
}

export const RouteGuard: React.FC<Props> = ({ children, meta }: Props) => {
    if (meta?.auth) {
        return <Navigate to="/login" />;
    }

    if (meta?.title) {
        document.title = meta.title;
    }

    return children;
};