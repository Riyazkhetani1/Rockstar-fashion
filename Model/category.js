
let { Category } = require("../Schema/category")
const { logger } = require("../helper/log")
let security = require("../helper/security")
let joi = require("joi")
let { Op } = require("sequelize")

//////////**********Add****************//////////////
async function add(params, userData) {
    let verify = await verifycategory(params).catch((error) => {
        return { error }
    })

    if (!verify || (verify && verify.error)) {
        logger.log("error", "category not created")
        return { error: verify.error, staus: 400 }
    }
    if (params.p_id) {
        let verifyUser = await Category.findOne({ where: { id: params.p_id } }).catch((error) => { return { error } })
        logger("error", "parent cannot find")
        if (!verifyUser || (verifyUser && verifyUser.error)) {
            return { error: "parent cannot find", status: 401 }
        }

        let catCheck = await Category.findOne({ where: { name: params.name, p_id: params.p_id } }).catch()
        if (catCheck) {
            return { error: "Already Created", status: 400 }
        }
    }

    params["created_by"] = userData.Id
    params["updated_by"] = userData.Id

    let cat = await Category.create(params).catch((err) => { return { error: err } })
    console.log("error in cat", cat)
    if (!cat || (cat && cat.error)) {
        return { error: "cat not created", status: 500 }
    }

    return { data: cat }


}

////////////*********************joi schema Add********************/////////////////
async function verifycategory(params) {
    let schema = joi.object({
        name: joi.string().min(3).max(55).required(),
        p_id: joi.number().required()
    })
    let valid = await schema.validateAsync(params, { abortEarly: false })
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

//////////************************VIEW ALL***********************////////////////
async function viewAll(params) {
    let verify = await verifyviewAll(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let record = (params.record) ? params.record : 10
    let page = (params.page) ? params.page : 1
    let offset = record * (page - 1)
    let where = {}
    if (params.cat) {
        where["name"] = { [Op.like]: `%${params.cat}%` }
    }
    let count = await Category.count({ where }).catch((error) => { return { error } })
    if (!count || (count && count.error)) {
        return { error: "internal server error", status: 500 }
    }
    if (count <= 0) {
        return { data: { total: count, page, record } }
    }
    let category = await Category.findAll({ where: where, limit: record, offset }).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        return { error: "internal server error", status: 500 }
    }
    return {
        data: { total: count, page, record, data: category }
    }
}

//////////////////////////////VIEW ALL JOI VALIDATION/////////////////////////////
async function verifyviewAll(params) {
    let schema = joi.object({
        page: joi.number().allow(""),
        cat: joi.string().allow(""),
        record: joi.number().allow("")
    })
    let verify = await schema.validateAsync(params, { abortEarly: false })
        .catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        let msg = [];
        for (let i of verify.error) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: verify.data }
}

/////////////////////////////////VIEW ONE///////////////////////////
async function viewOne(params) {
    let verify = await verifyviewOne(params).catch((error) => { return { error } });
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let check = await Category.findOne({ where: { id: params.id } }).catch((error) => { return { error } });
    if (!check || (check && check.error)) {
        return { error: "Not found", status: 400 }
    }
    return { data: check }
}

///////////////////////////////VIEW ONE JOI VALIDATION////////////////////
async function verifyviewOne(params) {
    let schema = joi.object({
        id: joi.number().allow(""),

    })
    let verify = await schema.validateAsync(params, { abortEarly: false })
        .catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        let msg = [];
        for (let i of verify.error) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: verify.data }
}
////////////////////////////////////////////Update////////////////////////////////
async function update(id, params, userData) {
    if (!parseInt(id)) {
        return { error: "invalide data", status: 400 }
    }
    let verify = await verifyUpdate(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let check = await Category.findOne({ where: { id: id } }).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: "not found", status: 400 }
    }
    if (params.p_id) {
        let find = await Category.findOne({ where: { id: params.id } }).catch((error) => { return { error } })
        if (!find || (find && find.error)) {
            return { error: "user not found", status: 400 }
        }
    }
    params["updated_by"] = userData.id

    let category = await Category.update(params, { where: { id: id } }).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        return { error: "Not updated", status: 500 }
    }
    return { data: category }
}

///////////////////////////////////Update joi schema////////////////////////////
async function verifyUpdate(params) {
    let schema = joi.object({
        id: joi.number().allow(""),
        name: joi.string().required(""),
        p_id: joi.number().allow("")
    })
    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid.data }
}

//////////**************************Delete***********************////////////////////
async function dlt(param, userData, decision) {
    let verify = await verifydlt(param).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    if (!param.id) {
        return { error: "invalid Data" }
    }

    let verifyUser = await Category.findOne({ where: { id: param.id } }).catch((err) => {
        return { error: err }
    })

    // console.log("verifyUser", verifyUser)
    if (!verifyUser || (verifyUser && verifyUser.error)) {
        return { error: "cannot found category", status: 400 }
    }

    param["created_by"] = userData.id
    param["updated_by"] = userData.id

    let cat = await Category.update({ is_deleted: decision, updated_by: userData.id }, { where: { id: param.id } }).catch((error) => {
        return { error }
    })
    if (!cat) {
        return { error: "not update", status: 500 }
    }
    return { data: cat }
}

//////////////********** delete**********///////////
async function verifydlt(param) {
    let schema = joi.object({
        id: joi.number().allow("")
    })
    let valid = await schema.validateAsync(param, { abortEarly: false })
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





module.exports = { add, dlt, viewAll, viewOne, update }
