const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter

});

const Product = require('../models/products');
const Cart = require('../models/cart');


//insert a new product
router.post('/add', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    let newProduct = new Product({
        productName: req.body.productName,
        unitPrice: req.body.unitPrice,
        minimumOrder: req.body.minimumOrder,
        category: req.body.category,
        availability: req.body.availability,
        imgSrc: req.file.path
    });

    newProduct.save()
        .then(() => {
            res.status(201).json({
                success: 'true',
                msg: 'Product Added Success.!'
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Product Added Failed .!'
            });
        });
});

router.get('/all', (req, res, next) => {
    Product.find()
        .then((products) => res.json(products))
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: err
            });
        });
});

router.get('/:id', (req, res, next) => {
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: err
            });
        });
});

router.delete('/:id', (req, res, next) => {
    Product.findByIdAnd(req.params.id)
        .then(() => {
            res.status(201).json({
                success: 'true',
                msg: 'Delete Success.!'
            })
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Failed Registration.!'
            });
        })
});

router.post('/update/:id', (req, res, next) => {
    Product.findById(req.params.id)
        .then((product) => {
            product.productName = req.body.productName;
            product.unitPrice = req.body.unitPrice;
            product.minimumOrder = req.body.minimumOrder;
            product.category = req.body.category;
            product.availability = req.body.availability;
            product.imgSrc = req.body.imgSrc

            product.save()
                .then(() => {
                    res.status(201).json({
                        success: 'true',
                        msg: 'Product Updated Success.!'
                    });
                })
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Updated Failed.!'
            });
        })
});



module.exports = router;