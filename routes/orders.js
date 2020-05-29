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

//Hero Script for external Functions
const hero = require('../extras/scripts')

router.post('/add', async(req,res,next)=>{

    try {
        const orderDetails = req.body;

    const groupedResult = hero.orderSeperation(orderDetails.products);
    //Get Arrays for each type Vegetables, Favourite Packs and Suggested Packs
    var vegetables = groupedResult.v;
    var suggestedPacks = groupedResult.p;
    var favouritePacks = groupedResult.u;
    var suggestedPackDetails=favouritePackDetails=[];
    var suggestedPackTotal=favouritePackTotal=vegetableTotal=0;
    var totalAmount = 0;
   
    //Vegetables Getting the Results from DB and modifying the end object
    if(vegetables){
        const vegetableIDs = _.pluck(vegetables,'_id');
        const resultVegetables = await Product.find({'_id':{$in:vegetableIDs}});
        // console.log(resultVegetables)
        vegetables.forEach(vegetable=>{
            let num = vegetables.indexOf(vegetable);
            vegetable._id = resultVegetables[num];
            var pricePerItem = (vegetable._id.unitPrice * vegetable.quantity)/100;
            vegetable.pricePerItem = pricePerItem;
            vegetableTotal += pricePerItem;
        });
        
    }
    //Suggested Packs - Getting Results from the DB and modify
    if(suggestedPacks){
        const suggestedPackIDs = _.pluck(suggestedPacks,'_id');
        const resultSuggestedPacks = await SuggestedList.find({'_id':{$in:suggestedPackIDs}}).populate('products._id');
        const amountOfthePacks = hero.getAmountOfThePack(resultSuggestedPacks);
        const finalOutput = hero.generateObjectS(resultSuggestedPacks, amountOfthePacks,suggestedPacks);
        suggestedPackDetails = finalOutput[0];
        suggestedPackTotal = finalOutput[1]
        
    }else{

    }
    //Favourite Packs - User Packs (Getting Results from the DB and then modify it)
    if(favouritePacks){
        const favouritePackIDs = _.pluck(favouritePacks,'_id');
        const resutltFavouritePacks = await FavouriteList.find({'_id':{$in : favouritePackIDs}}).populate('products._id');
        const amountOfthePacks = hero.getAmountOfThePack(resutltFavouritePacks);
        const finalOutput = hero.generateObject(resutltFavouritePacks,amountOfthePacks, favouritePacks);
        favouritePackDetails = finalOutput[0];
        favouritePackTotal = finalOutput[1];
        
        
    }
    
    totalAmount = vegetableTotal+suggestedPackTotal+favouritePackTotal;
    
   const order = hero.orderObject(orderDetails,vegetables,suggestedPackDetails,favouritePackDetails,totalAmount);
    const saveTheOrder = await order.save();
    const createTheTracking = new Tracking({
        _id : new mongoose.Types.ObjectId,
        orderID : order._id,
        status : 'Pending Approval'
    })
    const saveTracking = await createTheTracking.save();
    res.json({message : 'Order Saved'})    

    
    
    
    

    } catch (err) {
        res.status(404).json({message: err})
        console.log(err);
    }
    

    

});

//Get all the orders
router.get('/all', async(req,res,next)=>{
    
    try {
        const allOrders = await Order.find();
        res.status(201).json(allOrders)
        
    } catch (err) {
        res.status(404).json({message : err})
    }
    

});

//Get Orders By a certain Client
router.get('/:clientID', async(req,res,next)=>{
    try {
        const orderByClient = await Order.find({clientID : req.params.clientID});
        res.status(201).json(orderByClient)
    } catch (err) {
        res.status(404).json({message : err})
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