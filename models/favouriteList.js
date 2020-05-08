const mongoose = require('mongoose');

const ProductListItem = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }

})
const FavouriteListSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },

    availability: {
        type: Boolean,
        default: true
    },
    products: [ProductListItem],
    date: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model('FavouritePack', FavouriteListSchema);