let security = require("../helper/security")
let { sequelize, QueryTypes } = require("../Init/dbconfig");


function auth(permission) {
    //Checking permission
    return async (req, res, next) => {
        let token = (req.headers && req.headers.token) ? req.headers.token : null;
        if (!token) {
            return res.status(404).send({ error: "token not found in headers" })
        }
        //Token dcrypt
        let dcrypt = await security.dcrypt(req.headers.token,
            "1234").catch((err) => {
                return (err)
            })
        if (!dcrypt || (dcrypt && dcrypt.error)) {
            return res.status(401).send({
                error: "Unauthorised request"
            })
        }
        //console.log("dec",dcrypt)
        //user verify with query
        let user = await sequelize.query(`select
        user.Id,user.Name,user.Email,p.Name as permission
        from user
        left join userpermission as up
        on user.Id=up.User_id
        left join permission as p
        on p.Id=up.Permission_id
        where user.Id=:key and user.Token=:Token`,
            {
                replacements: { key: dcrypt.Id, Token: token },
                type: QueryTypes.SELECT

            }).catch((error) => {
                return { error }
            })
        console.log("user", user)
        if (!user || (user && user.error)) {
            return res.status(400).send({
                error: "Bad Request"
            })

        }
        //formating permission
        let permissions = {}
        // console.log("permission",permissions)
        for (let i of user) {
            permissions[i.permission] = true;
        }
        // console.log("permissions", permissions)
        if (!permissions[permission]) {
            return res.status(401).send("access deneid")
        }

        //  console.log("permission",permissions)
        req.userData = {
            Id: user[0].Id, name: user[0].Name, Email: user[0].Email,
            permissions
        }
        next();
    }
}

module.exports = { auth }