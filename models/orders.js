const mongoose = require('mongoose');

const ProductListItem = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    totalPricePerItem: {
        type: Number,
        required: true
    },
    isPack:{
        type: String,
        required: true,
        default: 'v'
    }
})

const order = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    date:{
        type: date,
        default: Date.now
    },
    orderAmount:{
        type: Number,
        required: true
    },
    deliveryCharges:{
        type: Number,
        required: true
    },
    commision:{
        type: Number,
        required: true
    },
    totalAmount:{
        type: Number,
        required: true
    },
    natureOfOrder:{
        type:String,
        required: true,
        default: 'Same Day'
    },
    statusOfCompletion: {
        type: String,
        required: true,
        default: 'Pending Approval'
    },
    product:[ProductListItem]



});

const order = module.exports = mongoose.model('Order', order);