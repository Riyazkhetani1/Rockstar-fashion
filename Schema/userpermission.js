let {sequelize,Model,DataTypes}=require("../Init/dbconfig")
class Userpermission extends Model{}
Userpermission.init({
    Id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    User_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    Permission_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{tableName:"userpermission",modelName:"Userpermission",sequelize})

module.exports={Userpermission}
