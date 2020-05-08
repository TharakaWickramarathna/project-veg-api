const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('underscore');
const SuggestedList = require('../models/suggestedList');
const Products = require('../models/products');
const hero = require('../extras/scripts');


//Views all of the suggested lists
router.get('/view', async(req, res) => {
    const suggestedList = await SuggestedList.find().populate('products._id');
    if (suggestedList.length === 0){
        res.json('No Entries were found in the DB')
    }else{
        const amount = hero.getAmountOfThePack(suggestedList);
        const results = hero.generateObjectS(suggestedList, amount);
        res.json(results);
    }
    
});

//Save a new pack to the database
router.post('/add', async(req, res) => {

    const suggestedList = new SuggestedList({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        discount: req.body.discount,
        availability: req.body.availability,
        products: req.body.products
    });
    try {
        const savedSuggestedList = await suggestedList.save();
        res.json({ message: "successfully saved the pack" });
    } catch (err) {
        res.json({ message: err });
    }

});

//Delete a pack from the database

router.delete('/delete/:packID', async(req, res) => {
    try {

        const deletedSuggestedList = await SuggestedList.deleteOne({ _id: req.params.packID });
        res.json({ message: "successfully Deleted" });

    } catch (err) {
        res.json({ message: err });
    }
});


//Edit a pack 
router.patch('/edit/:packID', async(req, res) => {

    try {
        const editedpack = await SuggestedList.updateOne({ _id: req.params.packID }, {
            $set: {
                name: req.body.name,
                discount: req.body.discount,
                availability: req.body.availability,
                products: req.body.products
            }
        });
        res.json("Edited the pack successfully");
    } catch (err) {
        res.json({ message: err });
    }

});


module.exports = router;