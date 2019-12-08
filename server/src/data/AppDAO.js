import sqlite3 from "sqlite3";
import config from "../config/index.js";

const { db_path } = config;

class Dao {
    constructor(path = db_path) {
        this.db = new sqlite3.Database(path, (err) => {
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
            this.db.run(sql, param, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const { lastID, changes, sql } = this;
                    if (sql.indexOf("INSERT INTO")) {
                        resolve({
                            lastID
                        });
                    } else {
                        resolve({
                            changes
                        });
                    }

                    /**
                     * BUG 警告！
                     * 一定要认真看文档
                     * 当成功执行INSERT操作时，lastID是有效的，而当执行UPDATE、DELETE时changes是有效的，也就是说UPDATE/DELETE时虽然也会返回lastID，但实际上这个lastID是上一个INSERT操作所遗留的lastID
                     */
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

const AppDAO = new Dao();

export default AppDAO;