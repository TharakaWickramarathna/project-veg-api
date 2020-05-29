const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tracking = require('../models/tracking');
const Order = require('../models/orders');
const hero = require('../extras/scripts');


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
    const orderTrack = await Tracking.find({orderID: req.params.orderID});
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
        
        
        if(status.toLowerCase() != 'completed'){const getTrackingDetails = await Tracking.findById({_id : req.params.id});
        const orderID = getTrackingDetails.orderID;
        const editOrder = await Order.updateOne({_id : orderID}, {
            $set:{
                statusOfCompletion : status
            }
        })
        
        
        const updateTracking = await Tracking.updateOne({_id: req.params.id},
            {$set: {status : status}});
        
        res.status(200).json('Successfullly Edited');}
        else{
            const deleteTrackingRecord = await Tracking.deleteOne({_id : req.params.id});
            res.status(200).json('Successfully Deleted')
        }
    } catch (err) {
        res.status(404).json({message : err});
    }
        
        
        
    
});



module.exports = router;