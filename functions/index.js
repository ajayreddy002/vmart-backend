const functions = require('firebase-functions');
var express = require('express');
var cors = require('cors')
var app = express();
var multer = require('multer')
var upload = multer();
var productController = require('../_controllers/addProcutController');
app.post('/add', upload.array('images'), productController.create);
app.get('/get', productController.index);
app.get('/get/:product_id', productController.index);
app.delete('/add/:product_id', productController.delete);
app.put('/add', productController.update);


app.use(cors());
