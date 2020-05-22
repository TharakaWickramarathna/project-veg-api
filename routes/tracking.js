const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tracking = require('../models/tracking');
const Order = require('../models/orders');
const hero = require('../extras/scripts');

//Add a new Tracking Element
router.post('/add', async(req,res,next)=>{
    const track = new Tracking({
        _id: mongoose.Types.ObjectId,
        orderID: req.body.orderID,
        status: req.body.status
    })
    try {
        const trackPost = await track.save();
        res.status(200).json({message: 'Succesfully Created The Tracking'})
    } catch (err) {
        res.status(404).json({message : err})
    }
});

//View All the Tracking Information
router.get('/all', async(req,res, next)=>{
    try {
        const allTrackingDetails = await Tracking.find();
        res.status(200).json(allTrackingDetails);
    } catch (err) {
        res.status(404).json({message: err})
    }
});

//View Tracking information of Specific Order
// By given orderID
router.get('/:orderID', async(req,res,next)=>{
    
try {
    const orderTrack = await Tracking.find({clientID: req.params.clientID});
    res.status(200).json(orderTrack);
} catch (err) {
    res.status(404).json({message: err})
}

});

//Delete A Tracking Element
router.delete('/:trackID', async(req,res,next)=>{
    
    try {
        const deleteTrackingDetails =  await Tracking.deleteOne({_id:req.params.trackID});
        res.status(200).json({message: 'Deleted Successfully'});    
    } catch (err) {
        res.status(404).json({message: err});
    }
});

//Edit the Status of A Tracking ID:
router.patch('/edit/:id', async(req,res,next)=>{
    try {
        const status = req.body.status;
        const passObject = hero.createUpdateObject(req.body);
        const updateTracking = await Tracking.updateOne({_id: req.params.id},
            {$set: passObject})
        res.status(200).json('Successfullly Edited')
        }
        
    } catch (err) {
        res.status(404).json({message: err});
    }
});