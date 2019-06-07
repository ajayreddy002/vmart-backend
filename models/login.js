'use strict';
module.exports = (sequelize, DataTypes) => {
  const login = sequelize.define('login', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  login.associate = function(models) {
    // associations can be defined here
  };
  return login;
};