import { ReactElement, Suspense, lazy } from "react";

export type RouteMeta = undefined | {
    auth?: Boolean,
    title?: string
};

export interface Route {
    index?: boolean,
    path: string,
    meta?: RouteMeta,
    children?: Route[],
    element: ReactElement
}

export type LoadComponentFn = () => Promise<any>;

export const createLazyComp = (fn: LoadComponentFn) => {
    const Component = lazy(fn);
    return (
        <Suspense>
            <Component />
        </Suspense>
    );
};