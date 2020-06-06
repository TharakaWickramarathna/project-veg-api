//Express and Router Variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Underscore JS
const _ = require('underscore')
    //Require DB Models
const Tracking = require('../models/tracking')
const Order = require('../models/orders')
const Product = require('../models/products')
const SuggestedList = require('../models/suggestedList');
const FavouriteList = require('../models/favouriteList');
const CompletedOrder = require('../models/completedOrders');

//Hero Script for external Functions
const hero = require('../extras/scripts')

router.get('/', async(req, res, next) => {

    try {
        const statusOfOrder = req.query.status;
        if (statusOfOrder != 'completed') {
            const result = await Order.find({
                statusOfCompletion: statusOfOrder
            });
            res.status(201).json(result);
        } else {
            const result = await CompletedOrder.find();
            res.status(201).json(result);
        }


    } catch (err) {
        res.status(404).json({
            message: err
        })
    }


})

router.post('/add', async(req, res, next) => {
    // var vegetables = [],
    //     vegcount = 0;
    // var suggesList = [],
    //     suggpackcount = 0;
    // var favoList = [],
    //     favpackcount = 0;

    try {
        const orderDetails = req.body;
        //     var pro = orderDetails.products;
        //     for (let i = 0; i < pro.length; i++) {
        //         if (pro[i].isPack == "v") {
        //             vegetables[vegcount] = pro[i];
        //             vegcount++;
        //         } else if (pro[i].isPack == "p") {
        //             suggesList[suggpackcount] = pro[i];
        //             suggpackcount++;
        //         } else {
        //             favoList[favpackcount] = pro[i];
        //             favpackcount++;
        //         }
        //     }

        //     for (let i = 0; i < vegetables.length; i++) {
        //         const resultVegetables = await Product.findById(vegetables[i]._id);
        //         vegetable._id = resultVegetables[num];
        //         var pricePerItem = (vegetable._id.unitPrice * vegetable.quantity) / 100;
        //         vegetable.pricePerItem = pricePerItem;
        //         vegetableTotal += pricePerItem;

        //     }




        const groupedResult = hero.orderSeperation(orderDetails.products);
        //Get Arrays for each type Vegetables, Favourite Packs and Suggested Packs
        var vegetables = groupedResult.v;
        var suggestedPacks = groupedResult.p;
        var favouritePacks = groupedResult.u;
        var suggestedPackDetails = favouritePackDetails = [];
        var suggestedPackTotal = favouritePackTotal = vegetableTotal = 0;
        var totalAmount = 0;

        //Vegetables Getting the Results from DB and modifying the end object
        if (vegetables) {
            const vegetableIDs = _.pluck(vegetables, '_id');
            const resultVegetables = await Product.find({ '_id': { $in: vegetableIDs } });
            // console.log(resultVegetables)
            vegetables.forEach(vegetable => {
                let num = vegetables.indexOf(vegetable);
                vegetable._id = resultVegetables[num];
                var pricePerItem = (vegetable._id.unitPrice * vegetable.quantity) / 100;
                vegetable.pricePerItem = pricePerItem;
                vegetableTotal += pricePerItem;
            });

        }
        //Suggested Packs - Getting Results from the DB and modify
        if (suggestedPacks) {
            const suggestedPackIDs = _.pluck(suggestedPacks, '_id');
            const resultSuggestedPacks = await SuggestedList.find({ '_id': { $in: suggestedPackIDs } }).populate('products._id');
            const amountOfthePacks = hero.getAmountOfThePack(resultSuggestedPacks);
            const finalOutput = hero.generateObjectS(resultSuggestedPacks, amountOfthePacks, suggestedPacks);
            suggestedPackDetails = finalOutput[0];
            suggestedPackTotal = finalOutput[1];

        }
        //Favourite Packs - User Packs (Getting Results from the DB and then modify it)
        if (favouritePacks) {
            const favouritePackIDs = _.pluck(favouritePacks, '_id');
            const resutltFavouritePacks = await FavouriteList.find({ '_id': { $in: favouritePackIDs } }).populate('products._id');

            const amountOfthePacks = hero.getAmountOfThePack(resutltFavouritePacks);
            const finalOutput = hero.generateObject(resutltFavouritePacks, amountOfthePacks, favouritePacks);
            favouritePackDetails = finalOutput[0];
            favouritePackTotal = finalOutput[1];


        }

        totalAmount = vegetableTotal + suggestedPackTotal + favouritePackTotal;

        var order = hero.orderObject(orderDetails, vegetables, suggestedPackDetails, favouritePackDetails, totalAmount);
        // res.json(order)

        const saveTheOrder = await order.save();
        const createTheTracking = new Tracking({
            _id: new mongoose.Types.ObjectId,
            orderID: order._id,
            status: 'Pending Approval'
        })
        const saveTracking = await createTheTracking.save();
        res.json({ message: 'Order Saved' })




    } catch (err) {
        res.status(404).json({
            message: err
        })
        console.log(err);
    }




});

//Get all the orders
router.get('/all', async(req, res, next) => {

    try {
        const allOrders = await Order.find();
        res.status(201).json(allOrders)

    } catch (err) {
        res.status(404).json({
            message: err
        })
    }


});

//Get Orders By a certain Client
router.get('/:clientID', async(req, res, next) => {
    try {
        const statusOfOrder = req.query.status;
        if (statusOfOrder != 'completed') {
            const result = await Order.find({
                clientID: req.params.clientID,
                statusOfCompletion: statusOfOrder
            });
            if (result) {
                res.status(201).json(result);
            } else {
                res.status(204).json({
                    message: 'No matching records were found'
                })
            }
        } else {
            const result = await CompletedOrder.find({
                clientID: req.params.clientID
            });
            if (result) {
                res.status(201).json(result);
            } else {
                res.status(204).json({
                    message: 'No matching records were found'
                })
            }
        }

    } catch (err) {
        res.status(404).json({
            message: err
        })
    }
})

module.exports = router;


// Structure of the Request Obect
// natureOfOrder : 'Scheduled' maybe added in the future
// {
//     "clientID":"5ea91de10f61de375c8775b5",
//     "products":[
//         {"_id": "5ec8b1e449199a0b48be1262",
//         "quantity":1,
//         "isPack":"p"},
//         {"_id": "5ec7b4d2f3cf07371067a86c",
//         "quantity":200,
//         "isPack":"v"},
//         {"_id": "5ec7b506f3cf07371067a86d",
//         "quantity":300,
//         "isPack":"v"}
//     ]
// }