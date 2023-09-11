const { rejects } = require("assert");
const { promises } = require("dns");
let multer = require("multer");
const { resolve } = require("path");
let fs = require("fs").promises

async function passFile(req, res, option = {}) {
    let limit = option.size ? option.size : 1024 * 5;
    let ext = option.ext ? option.ext : /jpg|png|gif/;
    let field = option.field ? option.field : null
    if (!field) {
        return { error: "please provide field" }
    }
    let file = multer({
        limit,
        fileFilter: (req, file, cb) => {
            let check = ext.test(file.mimetype);
            if (!check) {
                return cb("Error")
            }
            return cb(null, true);
        }
    })
    if (typeof (field)=="string"){
        file=file.single(field);
    }
    else if(typeof(field)=="object"){
        file=file.fields(field)
    }
    return new promise((resolve,rejects)=>{
        file(req,res,(err)=>{
            if(err){
                rejects(err);
            }
            resolve(true)
        })
    })
}