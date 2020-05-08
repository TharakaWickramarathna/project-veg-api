const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('underscore');
const FavouriteList = require('../models/favouriteList');
const Products = require('../models/products');
const hero = require('../extras/scripts');

//Request all the favourite packs from the database (For Admins)
router.get('/view', async(req, res) => {
    try {
        const favouriteList = await FavouriteList.find().populate('products._id');
        const lengthOfF = favouriteList.length;

        if (lengthOfF === 0) res.json("No Entries Found")
        else {
            const amount = hero.getAmountOfThePack(favouriteList);
            const result = hero.generateObject(favouriteList, amount);
            res.json(result);

        }
    } catch (err) {
        res.json({ message: err });
    }
});

//Request all the favourite packs by a userID
router.get('/:clientID', async(req, res) => {
    try {
        const favouriteList = await FavouriteList.find({ clientID: req.params.clientID }).populate('products._id');
        const lengthofF = favouriteList.length;
        if (lengthofF === 0) res.json("No Entries found");
        else {
            const amount = hero.getAmountOfThePack(favouriteList);
            const result = hero.generateObject(favouriteList, amount);
            res.json(result);
        }

    } catch (err) {
        res.json({ message: err });
    }
});

//Save Data to the Database
router.post('/add', async(req, res) => {

    const favouriteList = new FavouriteList({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        clientID: req.body.clientID,
        availability: req.body.availability,
        products: req.body.products
    });
    try {
        const savedFavouriteList = await favouriteList.save();
        res.json(savedFavouriteList);
    } catch (err) {
        res.json({ message: err });
    }

});

// Delete a Favourite pack from the database

router.delete('/delete/:packID', async(req, res) => {
    try {

        const deletedFavouriteList = await FavouriteList.deleteOne({ _id: req.params.packID });
        res.json(deletedFavouriteList);

    } catch (err) {
        res.json({ message: err });
    }
});

//Edit a pack information

router.patch('/edit/:packID', async(req, res) => {

    try {

        const editedPack = await FavouriteList.update({ _id: req.params.packID }, {
            $res: {
                name: req.body.name,
                clientID: req.body.clientID,
                availability: req.body.availability,
                products: req.body.products
            }
        });

        res.json(editedPack);

    } catch (err) {
        res.json({ message: err });
    }

});

module.exports = router;