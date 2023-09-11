let {sequelizeCon,Model,DataTypes}=require("../Init/dbconfig")
class Permission extends Model{}
Permission.init({
    Id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    Name:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{tableName:permission,modelName:Permission,sequelizeCon})

module.exports={Permission}