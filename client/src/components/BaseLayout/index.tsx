import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

type Props = {
    children?: ReactElement[]
};

const Layout = (props: Props) => {
    return (
        <div>
            <div>
                left
            </div>
            <Outlet />
        </div>
    )
};

export default Layout;