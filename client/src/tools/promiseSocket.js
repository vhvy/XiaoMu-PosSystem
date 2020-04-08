import net from "net";
const socket = new net.Socket();

export class PromiseSocket {
    constructor() {
        this.socket = new net.Socket();
    }

    async connect(port, host) {
        return new Promise((resolve) => {
            socket.connect(port, host, () => {
                console.log(`Connect To ${host}:${port}`);
                resolve();
            });
        });
    }

    write(data) {
        return new Promise((resolve, reject) => {

            const handleError = (err) => {
                removeAllListen();
                reject(err);
            }

            const handleData = (data) => {
                removeAllListen();
                resolve(data);
            }

            const handleClose = () => {
                removeAllListen();
                reject();
            }

            const removeAllListen = () => {
                this.socket.removeListener("data", handleData);

                this.socket.removeListener("error", handleError);

                this.socket.removeListener("close", handleClose);
            }

            this.socket.on("data", handleData);
            this.socket.on("error", handleError);
            this.socket.on("close", handleClose);

            this.socket.write(data);
        });
    }
}