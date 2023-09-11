const { error } = require("winston");
let { Product } = require("../Schema/product")
let joi = require("joi");
const { Category } = require("../Schema/category");
let { Op } = require("sequelize")
let { productCategory } = require("../Schema/productCategorys")

/////////////////////Add product joi schema////////////////////////////
async function verifyAdd(params) {
    let schema = joi.object({
        name: joi.string().min(5).max(55).required(),
        stock: joi.number().min(1).required(),
        stock_alert: joi.string().min(1).max(35).required(),
        description: joi.string().min(1).max(150).required(),
        detail: joi.object({
            brand: joi.string().required(),
            size: joi.string().required(),
            colour: joi.string().required()
        }),
        price: joi.number().min(1).required(),
        discount_type: joi.number().allow(null),
        discount: joi.number().allow(null),
        slug: joi.string().min(5).max(100).required(),
        gst_percentage: joi.number().allow(null)
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

///////////////////////////Add product////////////////////////
async function add(params, userData) {
    let verify = await verifyAdd(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let find = await Product.findOne({ where: { slug: params.slug }, raw: true }).catch((error) => { return { error } })
    if (find || (find && find.error)) {
        return { error: "product is already added ", status: 401 }
    }
    params["payable_amount"] = params.price
    if (params.discount_type == 1) {
        params["payable_amount"] = params.price - params.discount
    }
    if (params.discount_type == 2) {
        let amount = params.price * params.discount / 100
        params["payable_amount"] = params.price - amount
    }

    if (!params.gst_percentage || params.gst_percentage == 0 || params.gst_percentage > 28 || params.gst_percentage < 5) {
        params["gst_percentage"] = params["payable_amount"] * 5 / 100
        params["payable_amount"] = params.gst_percentage + params["payable_amount"]
    } else if (params.gst_percentage) {
        params["gst_percentage"] = params["payable_amount"] * params.gst_percentage / 100
        params["payable_amount"] = params.gst_percentage + params["payable_amount"]
    }

    // if (!params.discount_type || params.discount_type == 0) {
    //     params["payable_amount"] = params.price
    // }

    params["created_by"] = userData.Id
    params["updated_by"] = userData.Id

    params.detail = JSON.stringify(params.detail)
    console.log(params);
    let create = await Product.create(params).catch((error) => { return { error } })
    console.log(create.error)
    if (!create || (create && create.error)) {
        return { error: "not created", status: 500 }
    }
    return { data: create, status: 200 }
}

///////////////restore joi schema//////////
async function verifydeltrestore(params) {

    let schema = joi.object({
        id: joi.number().required()
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

////////////// restore ///////////////////
async function productdltrestore(params, userData, decision) {
    let verify = await verifydeltrestore(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    if (params.id) {
        let check = await Product.findOne({
            where: { id: params.id }
        }).catch((error) => { return { error } })
        if (!check || (check && check.error)) {
            return { error: "category not found" }
        }
    }
    params["created_by"] = userData.id
    params["updated_by"] = userData.id

    let update = await Product.update({ is_deleted: decision, updated_by: userData.id }, { where: { id: params.id } }).catch((error) => {
        return { error }
    })
    // console.log("update", update)
    if (!update || (update && update.error)) {
        return { error: "not update", status: 500 }
    }
    return { data: update }
}

//////////////// viewAll joi schema/////////
async function verifyviewall(params) {

    let schema = joi.object({
        page: joi.number().allow(""),
        record: joi.number().allow(""),
        name: joi.string().required()
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

////////////////////// viewAll //////////////////////////
async function viewall(params) {
    let verify = await verifyviewall(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let record = (params.record) ? parseInt(params.record) : 10
    let page = (params.page) ? params.page : 1
    let offset = record * (page - 1)

    let where = {}
    if (params.product) {
        where["name"] = { [Op.like]: `%${params.product}%` }
    }
    let count = await Product.count({ where }).catch((error) => { return { error } })
    if (!count || (count && count.error)) {
        return { error: "count not found", status: 404 }
    }
    if (count <= 0) {
        return { data: { total: count, page, record } }
    }
    let product = await Product.findAll({ where: where, limit: record, offset: offset }).catch((error) => { return { error } })
    if (!product || (product && product.error)) {
        return { error: product.error, status: 400 }
    }
    return { total: count, page, record, data: product }
}

//////////// view joi schema //////////////
async function verifyview(params) {

    let schema = joi.object({
        id: joi.number().required()
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

/////////////////// view //////////////////////////
async function view(params) {
    let verify = await verifyview(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let product = await Product.findOne({ where: { id: params.id } }).catch((error) => { return { error } })

    if (!product || product && product.error) {
        return { error: " not found", status: 400 }
    }
    return { data: product }
}

///////////////////// Update joi schema //////////////
async function verifyupdate(params) {

    let schema = joi.object({
        id: joi.number().required(),
        name: joi.string().allow(""),
        stock: joi.number().allow(null),
        price: joi.number().allow(null)

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

///////////////////// Update ///////////////////
async function update(params, userData) {


    let verify = await verifyupdate(params).catch((error) => { return { error } })
    if (!verify && verify.error) {
        return { error: verify.error, status: 400 }
    }
    let check = await Product.findOne({ where: { id: params.id } }).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        // console.log(check)
        return { error: "not found", status: 400 }
    }

    // if (params.name) {
    //     let find = await Product.findOne({ where: { id: params.name } }).catch((error) => { return { error } })
    //     if (!find || (find && find.errro)) {
    //         return { error: "not found", status: 400 }
    //     }
    // }
    params["updated_by"] = userData.id

    let product = await Product.update(params, { where: { id: check.id } }).catch((error) => { return { error } })

    if (!product || (product && product.error)) {
        return { error: "not updated", status: 500 }
    }
    return { data: "updated product successfuly", product, status: 200 }

}

// Assign Category Joi schema
async function verifAssignCategory(params) {
    let schema = joi.object({
        product_id: joi.number().required(),
        category_id: joi.array().allow(null)
    });
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

// Assign Category
async function AssignCategory(params) {
    let verify = await verifAssignCategory(params).catch((error) => { return { error } })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }

    //checking product in db || not
    let product = await Product.findOne({ where: { id: params.id } }).catch((error) => { return { error } })
    if (!product || (product && product.error)) {
        return { error: "Product not found", status: 400 }
    }
    // Find category on db/if not find then return
    let productCategory = []
    let cat_Id = params.category_id;
    if (params.category_id) {
        let categoryfind = await Category.findAll({ where: { id: { [Op.in]: cat_Id } } }).catch((error) => { return { error } })
        if (!categoryfind || (categoryfind && categoryfind.error)) {
            let error = (categoryfind && categoryfind.error) ? categoryfind.error : "Category id not found";
            return { error, status: 404 }
        }
        //listing product to category
        for (let i of categoryfind) {
            productCategory.push({ product_id: product.id, category_id: i.id, created_by: userData.id, updated_by: userData.id })
        }
    }

    let del = await productCategory.destroy({ where: { product_id: product.id } }).catch((error) => { return { error } })
    if (!del || (del && del.error)) {
        let error = (del && del.error) ? del.error : "Old product data not deleted|can't assign category|try again "
        return { error, status: 500 }
    }
    let prod_cat = await ProductCategory.bulkcreate(productCategory).catch((error) => { return { error } })
    if (!prod_cat || (prod_cat && prod_cat.error)) {
        let error = (prod_cat && prod_cat.error) ? prod_cat.error : "error on adding category|internal server error"
        return { error, status: 500 }
    }
    return { data: prod_cat }
}
module.exports = { add, productdltrestore, viewall, view, update, AssignCategory }