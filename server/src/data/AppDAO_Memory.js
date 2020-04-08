import sqlite3 from "sqlite3";

class AppDAO {
    constructor() {
        this.db = new sqlite3.Database(":memory:", (err) => {
            if (err) {
                console.log("Could not connect to database", err);
            } else {
                console.log("Connected to database");
            }
        });
    }

    _handleCloseErr(err) {
        if (err) {
            console.log("Database close failed!", err);
        } else {
            console.log("Database close over!");
        }
    }

    close(fn = this._handleCloseErr.bind(this)) {
        this.db.close(fn);
    }

    run(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID
                    });
                }
            })
        });
    }

    get(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, param, (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, param = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, param, (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    each(sql, param = []) {
        return new Promise((resolve, reject) => {
            let result = [];
            this.db.get(sql, param,
                (err, row) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        result.push(row);
                    }
                },
                (err, len) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(len);
                    }
                });
        });
    }
}

export default AppDAO;