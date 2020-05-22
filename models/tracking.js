const mongoose = require('mongoose')

const TrackingSchema = mongoose.Schema({

    _id:mongoose.Schema.Types.ObjectId,
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    status:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Tracking', TrackingSchema)