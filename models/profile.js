'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User)
    }
  }

  Profile.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    money: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
    hooks: {
      beforeCreate(Profile, option) {
        Profile.money = 0
      }
    }
  });
  return Profile;
};