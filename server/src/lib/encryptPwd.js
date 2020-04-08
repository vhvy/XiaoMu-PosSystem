import bcrypt from "bcrypt";

const saltRounds = 10;

export async function genSalt() {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                resolve(salt);
            }
        });
    })
}

export async function genHash(plaintextPwd) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPwd, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        })
    })
}

export async function validateData(plaintextpwd, encrypted) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintextpwd, encrypted, (err, same) => {
            if (err) {
                reject(err);
            } else {
                resolve(same);
            }
        });
    });
}