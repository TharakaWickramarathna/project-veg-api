const mongoose = require('mongoose');

const order = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    products = { type: Object, require: true },
    orderAmount: { type: Number, require: true },
    deliveryCharges: { type: Number, require: true },
    commission: { type: Number, require: true },
    totalAmount: { type: Number, require: true },
    orderNature: { type: String, require: true },
    contactno: { type: String, require: true },
    deliveryAddress: { type: String, require: true },
    date: { type: Date, default: Date.now },
    status: { type: String, require: true }

});

const order = module.exports = mongoose.model('Order', order);