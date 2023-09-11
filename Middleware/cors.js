let express=require("express")
let app=express()
let cors=require("cors")
let helmet=require("helmet")


app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

let whitelist=["Riyaz.com"]
app.use(cors({
    origin:(origin,xyz)=>{
        let check=false;
        for(let i of whitelist)
        {
            
        }
    }
}))