import React, { createContext, useMemo, useState } from "react";

interface HandleUploadLocale {
    (payload: Locale): void
}

interface LocaleValue {
    locale: Locale,
    handleUploadLocale: HandleUploadLocale
}

export const LocaleContext = createContext<LocaleValue>({} as LocaleValue);

type Props = {
    children: React.ReactElement[]
};

const LocaleProvider = ({ children }: Props) => {

    const [localeValue, setLocaleValue] = useState<Locale>(window.__LOCALE__);

    const handleUploadLocale: HandleUploadLocale = (locale: Locale) => {
        setLocaleValue(locale);
    }

    const value = useMemo(() => {
        return {
            locale: localeValue,
            handleUploadLocale
        };
    }, [localeValue]);

    return (
        <LocaleContext.Provider children={children} value={value} />
    );
}

export default LocaleProvider;