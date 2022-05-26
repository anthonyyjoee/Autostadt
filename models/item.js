'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.User, { foreignKey: "SellerId" })
      Item.hasMany(models.Transaction, { foreignKey: "ItemId" })
    }
    static addDot (amount) {
      let result = ''
      for (let i = 0; i < amount.length; i++) {
        result += amount[i]
        if (i === 1) {
          result += '.'
        }
      }
      return result
    }
  }
  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'name should not be empty'},
        notNull: true,
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'price should not be empty'},
        notNull: true,
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'stock should not be empty'},
        notNull: true,
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'description should not be empty'},
        notNull: true,
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'category should not be empty'},
        notNull: true,
      }
    },
    SellerId: DataTypes.INTEGER,
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'photo should not be empty'},
        notNull: true,
      }
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};