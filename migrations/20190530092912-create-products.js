'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_name: {
        type: Sequelize.STRING
      },
      product_category: {
        type: Sequelize.STRING
      },
      product_description: {
        type: Sequelize.STRING
      },
      product_quantity: {
        type: Sequelize.INTEGER
      },
      product_rating: {
        type: Sequelize.INTEGER
      },
      product_price: {
        type: Sequelize.INTEGER
      },
      product_images: {
        type: Sequelize.STRING
      },
      stock_avilability: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};