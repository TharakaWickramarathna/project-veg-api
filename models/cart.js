const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Object,
        require: true
    },
    date: {
        type: Date,
        default: 'currentDate'
    }
});

const Cart = module.exports = mongoose.model('Cart', CartSchema);


module.exports = function Cart(prevCart) {
    this.items = prevCart.items || {};
    this.totalQty = prevCart.totalQty || 0;
    this.totalAmount = prevCart.totalAmount || 0;

    this.add = function(item, id, weight) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, amount: 0 };
        }
        storedItem.qty += parseInt(weight);
        var subtotal = storedItem.item.pricePerUnit * (weight / 100);
        storedItem.amount += subtotal //price; //storedItem.item.pricePerUnit * storedItem.qty;
        this.totalQty++;
        this.totalAmount += subtotal; //price; //storedItem.item.pricePerUnit;

    }

    this.itemDetails = function() {
        let itemDetails = [];
        for (let id in this.items) {
            itemDetails.push(this.items[id]);
        }
        return itemDetails;
    }

}








// const mongoose = require('mongoose');

// const CartSchema = mongoose.Schema({
//     customer: {
//         type: String,
//         require: true
//     },
//     products: {

//     },
//     totalqty: {
//         type: Number,
//         require: true
//     },
//     totalamount: {
//         type: Number,
//         require: true
//     },
//     date: {
//         type: Date,
//         default: 'currentDate'
//     }
// });

// const Cart = module.exports = mongoose.model('Cart', CartSchema);


// module.exports = function Cart(prevCart) {
//     this.items = prevCart.items || {};
//     this.totalQty = prevCart.totalQty || 0;
//     this.totalAmount = prevCart.totalAmount || 0;

//     this.add = function(item, id) {
//         var storedItem = this.items[id];
//         if (!storedItem) {
//             storedItem = this.items[id] = { item: item, qty: 0, amount: 0 };
//         }
//         storedItem.qty++;
//         storedItem.amount = storedItem.item.pricePerUnit * storedItem.qty;
//         this.totalQty++;
//         this.totalAmount += storedItem.item.pricePerUnit;

//     }

//     this.itemDetails = function() {
//         let itemDetails = [];
//         for (let id in this.items) {
//             itemDetails.push(this.items[id]);
//         }
//         return itemDetails;
//     }

// }