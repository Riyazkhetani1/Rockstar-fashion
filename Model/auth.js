let { User } = require("../Schema/user")
let joi = require("joi")
let security = require("../helper/security")
let { userPermission, Userpermission } = require("../Schema/userPermission")
let { mail } = require("../helper/mailer")
let Otp = require("otp-generator")
const { error } = require("winston")
//let user=require("../Schema/user")

//////Registration api//////
async function register(params) {
    let verify = await verifyRegister(params)
        .catch((error) => { return { error } })

    // console.log("error in verify",verify)
    if (!verify || (verify && verify.error)) {
        return { error: "error in user data" }
    }
    //checking email is registerd or not
    let verifyUser = await User.findOne({ where: { Email: params.Email }, raw: true }).catch((error) => {
        return { error }
    })
    // console.log("error in verifuj",verifyUser)
    if (verifyUser) {
        return { error: "user already created" }
    }
    //password encryption
    let password = await security.hash(params.Password, 10)
        .catch((error) => {
            return { error }
        })
    if (!password || (password && password.error)) {
        return { error: "internal server error", status: 500 }
    }

    params.Password = password
    //user creation
    let user = await User.create(params)
        .catch((error) => {
            return { error }
        })
    console.log("user", user)
    if (!user || (user && user.error)) {
        return { error: "internal server error2", status: 500 }
    }
    //asign permission
    let userPermission = { User_id: user.Id, Permission_id: 1 }
    let UserP = await Userpermission.create(userPermission).catch((error) => {
        return { error }
    })
    console.log("up error", UserP)
    if (!UserP || (UserP && UserP.error)) {
        let dlt = await user.destroy({ where: { Id: user.Id } })
        if (!dlt || (dlt && dlt.error)) {
            return { error: "Contact admin" }
        }
        return { error: "user not created", status: 500 }
    }
    return { data: user }
}

//joi validation for register
async function verifyRegister(params) {
    let schema = joi.object({
        Name: joi.string().min(3).max(55).required(),
        Email: joi.string().min(8).max(155).required(),
        //phone:joi.string().min(8).max(12).required,
        Password: joi.string().min(6).max(15).required()
    })
    let valid = await schema.validateAsync(params, {
        abortEarly: false
    })
        .catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}


/////login/////
async function login(params) {
    let verify = await verifyLogin(params)
        .catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    //verify user
    let user = await User.findOne({
        where: {
            Email: params.Email
        }
    })
        .catch((error) => {
            return { error }
        })
    // console.log("user", user)
    if (!user || (user && user.error)) {
        return { error: "USer not found 1", status: 404 }
    }
    //verify password
    let check = await security.compare
        (params.Password, user.Password)
        .catch((error) => { error })
    if (!check || (check && check.error)) {
        return { error: "user not found 2", status: 401 }
    }
    //token generate
    let token = await security.encrypt({ Id: user.Id }, "1234")
        .catch((error) => { error })
    if (!token || (token && token.error)) {
        // console.log("token", token)
        return { error: "internal server error", status: 500 }
    }
    let updateUser = await User.update({ Token: token }, { where: { Id: user.Id } }).catch((error) => { return { error } })
    if (!updateUser || (updateUser && updateUser.error)) {
        return { error: "Token not save", status: 400 }
    }
    //return success
    return { data: "login success", status: 200 }
}
// //{
//     "Email":"khetaniriyo@gamil.com",
//     "Password":"Riyaz@1234"
// }
//joi validation for login
async function verifyLogin(param) {
    let schema = joi.object({
        Email: joi.string().min(8).max(155).required(),
        Password: joi.string().min(6).max(15).required()
    })
    let valid = await schema.validateAsync(param, {
        abortEarly: false
    })
        .catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}
//Forget
async function forgetPassword(param) {
    let verify = await verifyForgetPassword(param).catch((error) => { return { error } })
    // console.log("verify",verify)
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let user = await User.findOne({ where: { Email: param.Email } }).catch((error) => { return { error } })
    //console.log("user error",user)
    if (!user || (user && user.error)) {
        return { error: "user not found", status: 404 }
    }

    let otp1 = Otp.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
    //console.log("otp",otp1)
    let encrypt = await security.hash(otp1, 10).catch((error) => { return { error } })
    if (!encrypt || (encrypt && encrypt.error)) {
        return { error: "internal server error", status: 500 }
    }

    //console.log(otp1)
    //console.log(encrypt)
    user.otp = encrypt
    let result = await user.save().catch((error) => { return { error } })
    if (!result || (result && result.error)) {
        return { error: "internal server error", status: 500 }
    }
    let mailOption = {
        from: 'khetaniriyo@gmail.com',
        to: user.Email,
        sub: 'forgetpassword',
        text: `this is your ${otp1}`
    }
    let send = await mail(mailOption).catch((error) => { return { error } })
    if (!send || (send && send.error)) {
        console.log("email error", send)
        return { error: "internal server error", status: 500 }
    }

    return { send }
}


/////////////joi validation for Forget Password
async function verifyForgetPassword(param) {
    let schema = joi.object({
        Email: joi.string().min(12).max(155).required()
    })
    let valid = await schema.validateAsync(param, {
        abortearly: false
    }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}


/////////////// Reset Password
async function resetpassword(params) {
    let verify = await verifyResetPassword(params).catch((error) => {
        return (error)
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let user = await User.findOne({ where: { Email: params.Email } }).catch((error) => {
        return { error }
    })
    if (!user) {
        return { error: "email not found", status: 400 }
    }
    let check = await security.compare(params.otp, user.otp).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: "Invalid otp", status: 401 }
    }
    let encryptpassword = await security.hash(params.Password).catch((error) => {
        return { error }
    })
    if (!encryptpassword || (encryptpassword && encryptpassword.error)) {
        return { error: "server fault", status: 500 }
    }
    let update = await user.update({ Password: encryptpassword, otp: null }, { where: user.Email }).catch((error) => {
        return { error }
    })
    if (!update || (update && update.error)) {
        return { error: "Not updated", status: 500 }
    }
    return { data: "reset password sucessfully", status: 200 }
}

//////////// joi validation for Reset Password
async function verifyResetPassword(params) {
    let schema = joi.object({
        Email: joi.string().min(8).max(100).required(),
        otp: joi.string().min(6).required(),
        Password: joi.string().min(2).max(100).required()
    })
    let verify = await schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return (error)
    })
    if (!verify || (verify && verify.error)) {
        let msg = [];
        for (let i of verify.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: verify.data }
}


module.exports = { register, login, forgetPassword, resetpassword }