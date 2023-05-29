import 'react';

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}

interface Window {
    __LOCALE__: Locale
}
