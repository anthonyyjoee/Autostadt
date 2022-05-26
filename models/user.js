'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { user } = require('pg/lib/defaults');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Username cant be empty"},
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10],
          msg: "Password must have at least 10 characters"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "role is required"},
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(User, option) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(User.password, salt);
        User.password = hash
      }
    }
  });
  return User;
};