var express = require('express');
var router = express.Router();
var productController = require('../_controllers/addProcutController');
require('dotenv').config();
const googleStorage = require('@google-cloud/storage');
var multer  = require('multer')
var upload = multer()
// var upload = Multer({ storage: storage });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/add', upload.array('images'), productController.create);
router.get('/get', productController.index);
router.get('/get/:product_id', productController.index);
router.delete('/add/:product_id', productController.delete);
router.put('/add', productController.update);
router.post('/file', upload.array('images'), function (req, res) {
    console.log(req.files, 'files');
    res.send(req.files)
});
module.exports = router;
