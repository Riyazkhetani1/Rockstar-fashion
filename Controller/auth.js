///library import////
let auth = require("../Model/auth")
//////Registration///////
async function register(req, res) {
    let data = await auth.register(req.body)
    .catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal server error1"
        return res.status(500).send({ error })
    }
    return res.send(data)
}
///////////Login/////////
async function login(req, res) {
    let data = await auth.login(req.body)
    .catch((error) => {
        return { error: error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal server error1"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send(data)
}
/*****************forget passeord******************* */
async function forgetPassword(req, res) {
    let data = await auth.forgetPassword(req.body).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data })
}
//////////////////// Reset Password ////////////////
async function resetpassword(req, res) {
    let data = await auth.resetpassword(req.body).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send(data)
}
module.exports = { register, login, forgetPassword, resetpassword }