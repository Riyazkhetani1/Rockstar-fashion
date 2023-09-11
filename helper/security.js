let jwt = require("jsonwebtoken")

async function encrypt(data, key) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, key, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        })
    })
}

async function dcrypt(encryptedData, key) {
    return new Promise((resolve, reject) => {
        jwt.verify(encryptedData, key, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

///bcrypt
let bcrypt = require("bcrypt")

async function hash(PT, Salt = 10) {
    let encrypt = await bcrypt.hash(PT, Salt).catch((error) => { return { error } })
    if (!encrypt || (encrypt && encrypt.error)) {
        return { error: encrypt.error }
    }
    return encrypt
}

async function compare(PT, ET) {
    let check = await bcrypt.compare(PT, ET)
        .catch((error) => { return { error } })
    console.log("check", check)
    if (!check || (check && check.error)) {
        return { error: true }
    }
    return check
}

module.exports = { encrypt, dcrypt, hash, compare }