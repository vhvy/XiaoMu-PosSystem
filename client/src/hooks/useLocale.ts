import { useContext } from "react";
import { LocaleContext } from "@/provider/LocaleProvider";

const useLocale = () => {
    const { locale, handleUploadLocale } = useContext(LocaleContext);

    return {
        locale,
        handleUploadLocale
    };
}

export default useLocale;