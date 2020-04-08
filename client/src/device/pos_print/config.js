const GLOBAL_KEY = "GLOBAL_POS_PRINT_NAME";

export class PosPrintConfig {
    static getPosPrintName() {
        return localStorage.getItem(GLOBAL_KEY);
    }

    static setPosPrintName(name) {
        localStorage.setItem(GLOBAL_KEY, name);
    }
}