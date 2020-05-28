const mongoose = require('mongoose');

const sug = require('./suggestedList');

const CartItem = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId || sug.Types.ObjectId,
        ref: 'Product',
        // ref: 'Product',

        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    isPack: {
        type: String,
        required: true
    }

});

const CartSchema = mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: [CartItem], // || [sug],

    date: {
        type: Date,
        default: Date.now
    }

});

const Cart = module.exports = mongoose.model('Cart', CartSchema);