const mongoose = require('mongoose');

const ProductListItem = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }

})
const SuggestedListSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },

    products: [ProductListItem],

    date: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model('SuggestedPack', SuggestedListSchema);