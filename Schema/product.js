let { sequelize, Model, DataTypes } = require("../Init/dbconfig")


class Product extends Model { }
Product.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_alert: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payable_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    gst_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { modelName: "Product", tableName: "product", sequelize })

module.exports = { Product }