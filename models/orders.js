const mongoose = require('mongoose');

const ProductListItem = mongoose.Schema({
    _id: {
        type: Object,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    pricePerItem: {
        type: Number,
        required: true
    },
    isPack:{
        type: String,
        required: true,
        default: 'v'
    }
})
const PackListItem = mongoose.Schema({
    _id :{
        
    },
    quantity : {
        type : Number,
        required : true
    },
    isPack : {
        type : String,
        required : true
    },
    packAmount: {
        type : Number,
        required : true
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
        type: Date,
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
    vegetables:[ProductListItem],
    featuredPacks : [PackListItem],
    userPacks : [PackListItem]



});

module.exports = mongoose.model('Order', order);