const express = require('express');
const router = express.Router();

const Orders = require('../models/orders')

//insert a new order
router.post('/add', (req, res, next) => {

    let user = req.session.user;
    let cart = req.session.cart;

    let newOrder = new Orders({
        user: user,
        products: cart,
        orderAmount: req.body.orderAmount,
        deliveryCharges: req.body.deliveryAddress,
        commission: req.body.commission,
        totalAmount: req.body.totalAmount,
        orderNature: req.body.orderNature,
        contactno: req.body.contactno,
        deliveryAddress: req.body.deliveryAddress,
        date: req.body.date,
        status: req.body.status

    });

    newOrder.save()
        .then(() => {
            res.status(201).json({
                success: 'true',
                msg: 'Order Added Success.!'
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'order Added Failed .!'
            });
        });
});