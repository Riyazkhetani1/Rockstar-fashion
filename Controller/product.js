const { func } = require("joi");
let product = require("../Model/Product")

////////// add ///////////////////
async function add(req, res) {
    let data = await product.add(req.body, req.userData).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        console.log(data.error)
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

//////////// Dlt //////////////
async function dlt(req, res) {
    let data = await product.productdltrestore(req.params, req.userData, decision = 1).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

///////////// Restore /////////////////////
async function restore(req, res) {
    let data = await product.productdltrestore(req.params, req.userData, decision = 0).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

/////////////// viewAll //////////////
async function viewAll(req, res) {
    console.log("here")
    let data = await product.viewall(req.query, req.userData).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function view(req, res) {
    let data = await product.view(req.params, req.userData).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        // console.log("date.error", data)
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data: data })
}
async function update(req, res) {
    let data = await product.update(req.body, req.userData).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        // console.log("data.error", data)
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.status(200).send({ data: data.data })
}

module.exports = { add, dlt, restore, viewAll, view, update }

