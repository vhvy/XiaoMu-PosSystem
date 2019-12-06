import jwt from "jsonwebtoken";

const privateKey = process.env.JWT_KEY;

class Jwt {
    static sign(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, privateKey, {
                expiresIn: "12h"
            }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    static verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, privateKey, (err, decode) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decode);
                }
            });
        });
    }
}

export default Jwt;