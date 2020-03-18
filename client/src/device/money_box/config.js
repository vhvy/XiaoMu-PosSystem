const keys = "GLOBAL_MONEY_BOX_STATUS";

export class MoneyBoxConfig {
    static setConfig(config) {
        localStorage.setItem(keys, JSON.stringify(config));
    }

    static getConfig() {
        const value = localStorage.getItem(keys);
        try {
            return JSON.parse(value);
        } catch (error) {
            return {};
        }
    }
}