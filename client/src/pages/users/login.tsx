import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default () => {

    const { handleLoginSuccess } = useAuth();

    return <div>Login</div>
}