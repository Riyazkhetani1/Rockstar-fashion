let {Sequelize,Model,DataTypes,QueryTypes}= require ("sequelize")
let sequelize=new Sequelize("mysql://root:@localhost/user1");
sequelize.authenticate().then(()=>{
    console.log("Connected to db")
}).catch((error)=>{console.log(error)})

module.exports={Model,DataTypes,sequelize,QueryTypes}