export function throttle(fn, delay = 300) {
    let flag = true;
    return function (...arg) {
        if (flag) {
            flag = false;
            fn.call(null, ...arg);
            setTimeout(() => {
                flag = true;
            }, delay);
        }
    }
} 