const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CompletedOrder = require('../models/completedOrders');

router.get('/all', async(req,res,next)=>{
    try {
        const completedOrders = await CompletedOrder.find();
        res.status(201).json(completedOrders);
    } catch (err) {
        res.status(404).json({message: err})
    }
})


router.get('/:orderID', async(req,res,next)=>{
    try {
        const completedOrder = await CompletedOrder.findById(req.params.orderID);
        res.status(201).json(completedOrder)
    } catch (err) {
        res.status(404).json({message: err})
    }
})

module.exports = router;
