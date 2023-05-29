import StorageKeys from "@/constants/storage";
import storage from "@/utils/storage";

export const locales = [
    {
        language: "简体中文",
        code: "zh-CN"
    },
    {
        language: "English",
        code: "en-US"
    }
].map(item => {
    return {
        ...item,
        loadFunc: () => import(`@/i18n/lang/${item.code}.json`)
    };
});


export const initDefaultLocale = async () => {
    let localeCode = storage.getItem(StorageKeys.LOCALE);

    let localeItem = locales.find(i => i.code === localeCode);

    if (!localeItem) {
        localeItem = locales.find(i => i.code === navigator.language);
        if (!localeItem) {
            localeItem = locales[0];
        }
    }

    return localeItem.loadFunc()
        .then((module) => {
            window.__LOCALE__ = module.default as Locale;
        });
}