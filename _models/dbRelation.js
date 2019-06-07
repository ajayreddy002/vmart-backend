const Sequelize = require('sequelize'); 
const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;
db.products = require('../models/products')(Sequelize, sequelize);
db.images = require('../models/productimages')(Sequelize, sequelize);
// db.products = require('../models/products')(Sequelize, sequelize);
module.exports = db;