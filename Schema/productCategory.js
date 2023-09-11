let { sequelize, Model, DataTypes } = require("../Init/dbconfig")

class ProductCategory extends Model { }
ProductCategory.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { modelName: "ProductCategory", tableName: "product_category", sequelize })

module.exports = { ProductCategory } 