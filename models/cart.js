const mongoose = require('mongoose');

const CartItem = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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

})

const CartSchema = mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: [CartItem],

    date: {
        type: Date,
        default: Date.now
    }

});

const Cart = module.exports = mongoose.model('Cart', CartSchema);