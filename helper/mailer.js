let nodemailer=require("nodemailer")
async function mail(mailOption){
    return new Promise((res,rej)=>{
    let transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"khetaniriyo@gmail.com",
            pass:"nxdxcjhaqchpgkma"
        }
    })
        transporter.sendMail(mailOption,(error,info)=>{
            if (error){
                rej(error)
            }
            res("mail send")
        })
    })
}

module.exports={mail}