import { useRef, useEffect } from "react";

const useDidMountEffect = (func: Function, deps: any[] = []) => {
    let isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            func();
        } else {
            isMounted.current = true;
        }
    }, deps);

}

export default useDidMountEffect;