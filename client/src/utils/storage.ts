import StorageKeys from "@/constants/storage";

type Drive = Storage;

class BaseStorage {
    #drive: Drive;

    constructor(drive: Drive) {
        this.#drive = drive;
    }

    getItem<T = string>(key: StorageKeys): T | null {
        const rawValue = this.#drive.getItem(key);
        if (!rawValue) return null;
        try {
            const value = JSON.parse(rawValue);
            return value;
        } catch {
            return null;
        }
    }

    setItem(key: StorageKeys, value: string | object | null) {
        if (value) {
            this.#drive.setItem(key, JSON.stringify(value));
        } else {
            this.#drive.removeItem(key);
        }
    }

    removeItem(key: StorageKeys) {
        this.#drive.removeItem(key);
    }

    clear() {
        this.#drive.clear();
    }
}

export default new BaseStorage(localStorage);