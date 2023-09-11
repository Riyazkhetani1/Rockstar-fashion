let auth=require("../Model/auth")
async function forgetPassword(req,res){
    let data=await auth.forgetPassword(req.body).catch((error)=>{return{error}})
    if(!data||(data&&data.error)){
        let error=(data&&data.error)?data.error:"internal server error"
        let status=(data&&data.status)?data.status:500
        console.log("data",data)
        return res.status(status).send({error})
    }
    return res.send({data})
}
module.exports={forgetPassword}