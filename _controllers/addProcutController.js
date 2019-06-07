const models = require('../models');
const productModel = models.Products;
const pro_images = models.ProductImages;
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'vmart-278cf',
    keyFilename: 'json/vmart-1e4c951c42a9.json',
});
const format = require('util').format;
const fs = require('fs');
const bucket = storage.bucket("gs://vmart-278cf.appspot.com");
const firebaseConfig = {
    apiKey: "AIzaSyDwIen-_b4J56o6XyIVs7Zh-C71JiVqHac",
    authDomain: "vmart-278cf.firebaseapp.com",
    databaseURL: "https://vmart-278cf.firebaseio.com",
    projectId: "vmart-278cf",
    storageBucket: "vmart-278cf.appspot.com",
    messagingSenderId: "1076020984273",
    appId: "1:1076020984273:web:092c6be55e693fe1"
};
// Relations
models.Products.hasMany(models.ProductImages, {
    foreignKey: 'product_id'
});
// firebase.initializeApp(firebaseConfig);
productController = module.exports = {
    create: async (req, res) => {
        console.log(req.files, 'files');
        if (req.body.product_name, req.body.product_category,
            req.body.product_price, req.body.product_quantity,
            req.body.product_description, req.body.stock_avilability, req.files) {
            const dummy = await models.Products.create(
                {
                    product_name: req.body.product_name,
                    product_category: req.body.product_category,
                    product_description: req.body.product_description,
                    product_quantity: req.body.product_quantity,
                    product_rating: req.body.product_rating,
                    product_price: req.body.product_price,
                    product_images: req.body.product_images,
                    stock_avilability: req.body.stock_avilability,
                }
            );
            if (dummy.dataValues.id) {
                // Uploading images to gcloud
                const gCloud = await productController.uploadFilesToFireBase(req.files, dummy.dataValues.id).then(data => {
                    res.send({ code: 200, message: 'Data Inserted' });
                }).catch(e => {
                    console.log(e);
                });
                res.send({ code: 200, message: 'Data Inserted' });
            } else {
                res.status(400).end('Something went wrong');
            }
        } else {
            res.status(400).end('Required Parameters are Missing');
        }
    },
    index: (req, res) => {
        if (req.params.product_id) {
            models.Products.findAll({
                include: [{
                    where: { product_id: req.params.product_id },
                    model: models.ProductImages
                }
                ]
            }).then(data => {
                res.send(data);
            }).catch(e => {
                console.log(e)
            })
        } else {
            models.Products.findAll({
                include: [
                    {
                        model: models.ProductImages,
                        limit: 1
                    }
                ]
            }).then(async data => {
                const files = await productController.getFilesFromGCloud(data).then(files => {
                    console.log(files, 'filesmetho')
                    data
                    res.send(data);
                }).catch(error => {
                    console.log(error);
                });
            }).catch(e => {
                console.log(e);
                res.status(400).end('Something went wrong');
            });
        }
    },
    update: async (req, res) => {
        if (req.body.product_id) {

            const dummy = await models.Products.update(
                {
                    product_name: req.body.product_name,
                    product_category: req.body.product_category,
                    product_description: req.body.product_description,
                    product_quantity: req.body.product_quantity,
                    product_rating: req.body.product_rating,
                    product_price: req.body.product_price,
                    product_images: req.body.product_images,
                    stock_avilability: req.body.stock_avilability,
                },
                {
                    where: { id: req.body.product_id }, returning: true,
                    plain: true
                }).then(data => {
                    console.log(data);
                });
            if (dummy) {
                res.status(200).end('Data Updated');
            } else {
                res.status(400).end('Something went wrong');
            }
        } else {
            res.status(400).end('Required Parameters are Missing');
        }
    },
    delete: async (req, res) => {
        console.log(req.params.product_id)
        if (req.params.product_id) {
            models.Products.destroy({
                where: { id: req.params.product_id },
            }).then(data => {
                console.log(data);
                if (data === 1) {
                    // res.send('Deleted');
                    res.status(200).end('Deleted');
                } else {
                    // res.send('Deleted');
                    res.status(200).end('No Record Found');
                }
            }).catch(e => {
                res.status(400).end('Something went wrong');
            });
        } else {
            res.status(400).end('Required Parameters are Missing');
        }
    },


    /**
     * Upload the image file to Google Storage
     * @param {files} file object that will be uploaded to Google Storage
     */
    uploadFilesToFireBase: async (files, product_id) => {
        return new Promise((resolve, reject) => {
            if (!files) {
                reject('No image file');
            }
            files.map(item => {
                let newFileName = `${product_id}/${item.originalname}_${Date.now()}`;

                let fileUpload = bucket.file(newFileName);

                const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: item.mimetype,
                    },
                });

                blobStream.on('error', (error) => {
                    reject('Something is wrong! Unable to upload at the moment.');
                    console.log(error);
                });

                blobStream.on('finish', async (err, data) => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
                    if (url) {
                        const test = await productController.updateProductImagestable(product_id, fileUpload.name)
                    }
                    resolve(url);
                });

                blobStream.end(item.buffer);
            });
        });
    },
    /** 
     * Inserting img path in table for getting ref
     * @param {id, fileData} id is productId and file data is img info
    */
    updateProductImagestable: (id, fileData) => {
        return new Promise((resolve, reject) => {
            models.ProductImages.create(
                {
                    img_path: fileData,
                    product_id: id
                }
            ).then(data => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        })
    },
    getFilesFromGCloud:  (fileData) => {
        return new Promise ((resolve, reject)  => {
            fileData.map( item => {
                item.ProductImages.map(async item2 => {
                    console.log(item2.img_path.split('/'))
                    const prefix = item2.img_path.split('/')
                    console.log(prefix)
                    const options = {
                        prefix: prefix[0]
                    }
                    const [files] = await storage.bucket(bucket.name).file(`${prefix[0]}/${prefix[1]}`).getMetadata();
                    if (files) {
                        resolve(files)
                    }

                    console.log('Files:', files);
                    // files.forEach(file => {
                        // console.log(file);
                    // });
                })
            })
        })
    }
}