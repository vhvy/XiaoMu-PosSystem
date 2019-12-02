export default class RunMode {
    static set mode(m) {
        localStorage.setItem("POSSYSTEM_RUNMODE", m);
    }

    static get mode() {
        return localStorage.getItem("POSSYSTEM_RUNMODE") === "CLIENT" ? "CLIENT" : "SERVER";
    }
}