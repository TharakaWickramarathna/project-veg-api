const mongoose = require('mongoose');

//User Schema
const ProductSchema = mongoose.Schema({
   
    productName: {
        type: String
            // required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    minimumOrder: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    availability: {
        type: Boolean,
        required: true
    },
    imgSrc:{
        type: String,
        required : true
    }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.getProductById = function(id, callback) {
    User.findById(id, this.callback);
}
module.exports.getProductByName = function(productName, callback) {
    const query = { productName: productName};
    User.findByEmail(query, callback);
}