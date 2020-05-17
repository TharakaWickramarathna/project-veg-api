const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');

router.get('/details', (req, res, next) => {
    Cart.find()
        .then((cart) => console.log(cart))
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: err
            });
        });
});

router.post('/add', (req, res, next) => {
    // var cart = new Cart(req.session.cart);
    let newcart = new Cart({
        user: req.body.user,
        product: req.body.products,
        date: '2020-02-02'
    });
    newcart.save()
        .then(() => {
            res.status(201).json({
                success: 'true',
                msg: 'Product Added to the Cart.!'
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Failed Cart Added .!'
            });
        });
});

module.exports = router;