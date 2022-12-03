import StorageKeys from "@/constants/storage";
import { useState } from "react"
import storage from "@/utils/storage";

type StorageVal = object | string | null;

const useStorage = (key: StorageKeys) => {
    const [value, setValue] = useState<StorageVal>(storage.getItem(key));

    const setStorageValue = (nextValue: StorageVal) => {
        if (nextValue) {
            setValue(nextValue);
            storage.setItem(key, nextValue);
        } else {
            setValue(nextValue);
            storage.removeItem(key);
        }
    }

    return [value, setStorageValue];
}

export default useStorage;