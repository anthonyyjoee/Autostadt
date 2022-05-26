'use strict';

const { sequelize } = require("../models");

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Items', 'photo', Sequelize.STRING, {});
  },

  down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Items', 'photo');
  }
};
