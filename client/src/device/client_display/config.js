const keys = "GLOBAL_CLIENT_DISPLAY_CONFIG";

export class ClientDisplayConfig {
    static getConfig() {
        const value = localStorage.getItem(keys);
        try {
            return JSON.parse(value);
        } catch (error) {
            return undefined;
        }
    }

    static setConfig(config) {
        localStorage.setItem(keys, JSON.stringify(config));
    }
}