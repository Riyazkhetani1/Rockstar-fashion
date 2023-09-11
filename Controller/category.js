const { func } = require("joi")
let auth = require("../Model/category")

async function add(req, res) {
    let data = await auth.add(req.body, req.userData)
        .catch((error) => { return { error } })
    console.log("error", data)
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    res.send(data)
}

async function update(req, res) {
    let data = await auth.update(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        console.log("update.error", data)
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    res.send(data)
}

async function dlt(req, res) {
    let data = await auth.dlt(req.params, req.userData, decision = 1).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        //console.log("dd", data)
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    res.send(data)
}


async function restore(req, res) {
    let data = await auth.restore(req.params, req.userData, decision = 0).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
}


async function viewAll(req, res) {
    let data = await auth.viewAll(req.query, req.userData).catch((error) => { return { error } })
    //console.log("data", data)
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send(data)
}

async function viewOne(req, res) {
    let data = await auth.viewOne(req.params, req.userData).catch((error) => { return { error } })
    console.log("data", data)
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send(data)
}
module.exports = { add, dlt, restore, viewAll, viewOne, update }


console.log(typeof (null))