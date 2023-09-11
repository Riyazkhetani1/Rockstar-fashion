let express = require("express")
let app = express()
let user = require("./Controller/auth")
// let md=require("./Middleware/auth")
// let model=require("./Model/auth")
let { auth } = require("./Middleware/auth")
let category = require("./Controller/category")
let product = require("./Controller/product")
let { forgetPassword } = require("./Controller/mailer")
const { resetpassword } = require("./Model/auth")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/user/register", user.register)
app.post("/user/login", user.login)
app.post("/user/forgetpassword", user.forgetPassword)
app.put("/user/resetPassword", user.resetpassword)
app.get("/Demo", auth("user"), (req, res) => {
    res.send(req.userData)
})
app.post("/category", auth("user"), category.add)
app.put("/category/update/:id", auth("update_student"), category.update)
app.delete("/category/:id", auth("delete_faculty"), category.dlt)
//app.delete("/category/:id", auth("update_student"), category.restore)
app.get("/category/viewAll/:id", auth("view_student"), category.viewAll)
app.get("/category/:id", auth("view_student"), category.viewOne)

///////Product
app.post("/product/add", auth("add_faculty"), product.add)
app.put("/product/update", auth("update_student"), product.update)
app.get("/product/viewAll", auth("view_student"), product.viewAll)
app.get("/product/:id", auth("view_student"), product.view)
app.delete("/product/delete", auth("delete_faculty"), product.dlt)
module.exports = { app }