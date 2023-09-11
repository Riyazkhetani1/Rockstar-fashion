let { sequelize, Model, DataTypes } = require("../Init/dbconfig")
class User extends Model { }
User.init({
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: "user", modelName: "User", sequelize });

module.exports = { User }
