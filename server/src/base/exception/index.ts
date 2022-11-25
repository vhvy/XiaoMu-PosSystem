export default class Expection extends Error {
    public message: string;
    public status: number;

    constructor(message: string, status: number = 400) {
        super(message);
        this.message = message;
        this.status = status;
    }
}