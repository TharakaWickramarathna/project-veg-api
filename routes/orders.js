//Express and Router Variables
const express = require('express');
const router = express.Router();

//Underscore JS
const _ = require('underscore')
//Require DB Models
const Orders = require('../models/orders')
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

    
   
    if(vegetables){
        const vegetableIDs = _.pluck(vegetables,'_id');
        const resultVegetables = await Product.find({'_id':{$in:vegetableIDs}})
        // console.log(resultVegetables)
        vegetables.forEach(vegetable=>{
            let num = vegetables.indexOf(vegetable);
            vegetable._id = resultVegetables[num];
            vegetable.pricePerItem = (vegetable._id.unitPrice * vegetable.quantity)/100;
        });
        console.log(vegetables)
        
    }else{
        // return empty array   
    }
    
    
    const suggestedPackIDs = _.pluck(suggestedPacks,'_id');
    const favouritePackIDs = _.pluck(favouritePacks,'_id');

    
    
    
    // console.log(vegetableIDs);
    // console.log(suggestedPackIDs);
    // console.log(favouritePackIDs);

    } catch (err) {
        res.status(404).json({message: err})
        console.log(err);
    }
    

    

});

module.exports = router;

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