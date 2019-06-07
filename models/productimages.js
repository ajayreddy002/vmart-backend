'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductImages = sequelize.define('ProductImages', {
    product_id: DataTypes.INTEGER,
    img_path: DataTypes.STRING
  }, {});
  ProductImages.associate = function(models) {
    // associations can be defined here
  };
  return ProductImages;
};