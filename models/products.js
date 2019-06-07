'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    product_name: DataTypes.STRING,
    product_category: DataTypes.STRING,
    product_description: DataTypes.STRING,
    product_quantity: DataTypes.INTEGER,
    product_rating: DataTypes.INTEGER,
    product_price: DataTypes.INTEGER,
    product_images: DataTypes.STRING,
    stock_avilability: DataTypes.STRING
  }, {});
  Products.associate = function(models) {
    // associations can be defined here
  };
  return Products;
};