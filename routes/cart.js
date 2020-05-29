const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const Products = require('../models/products');
const suggestedList = require('../models/suggestedList');
const favouriteList = require('../models/favouriteList');


router.get('/view/:clientID', async(req, res, next) => {

    var userid = req.params.clientID;
    //output object
    var completeCart = {
        clientId: userid,
        listOfProduct: [],
        listOfSuggestedPack: [],
        listOfUserPack: []

    };
    //to include cart items
    var suggestedArr = [];
    var favArr = [];
    var productArr = [];

    var suggestPackCount = 0;
    var productCount = 0;
    var userPackCount = 0;

    var productCost = 0;
    var suggestedPackCost = 0;
    var userPackCost = 0;

    try {
        const carts = await Cart.findOne({ clientId: userid }); //.populate('product.productId' || 'products._id');
        // res.json(carts);
        for (let i = 0; i < carts.product.length; i++) {
            if (carts.product[i].isPack == "p") {
                const suggested = await suggestedList.findById(carts.product[i].productId).populate("products._id");
                // catch to each products in suggested Pack
                suggested.products.forEach(items => {
                    const suggestedValue = (items._id.unitPrice / items._id.minimumOrder) * items.quantity;
                    suggestedPackCost += suggestedValue;
                });

                suggestedArr[suggestPackCount] = {
                    itemList: suggested,
                    quantity: carts.product[i].quantity,
                    totalPricePerItem: suggestedPackCost
                };
                suggestPackCount++;
                // res.json(suggested);
            } else if (carts.product[i].isPack == "v") {
                const pro = await Products.findById(carts.product[i].productId);
                const productValue = (pro.unitPrice / pro.minimumOrder) * carts.product[i].quantity;
                productCost += productValue;
                productArr[productCount] = {
                    itemList: pro,
                    quantity: carts.product[i].quantity,
                    totalPricePerItem: productValue
                };
                productCount++;
            } else if (carts.product[i].isPack == "u") {
                const fav = await favouriteList.findById(carts.product[i].productId).populate("products._id");
                fav.products.forEach(items => {
                    const favedValue = (items._id.unitPrice / items._id.minimumOrder) * items.quantity;
                    userPackCost += favedValue;
                });
                favArr[userPackCount] = {
                    itemList: fav,
                    quantity: carts.product[i].quantity,
                    totalPricePerItem: userPackCost
                };
                userPackCount++;
            }
        }
        completeCart.listOfProduct = productArr;
        completeCart.listOfSuggestedPack = suggestedArr;
        completeCart.listOfUserPack = favArr;

        res.json(completeCart);
    } catch (e) {
        res.json({
            success: false,
            msg: "There is no cart found.." //"No such cart found...."
        })
    }
});

router.post('/add', (req, res, next) => {
    var user = req.body.clientId;
    var products = req.body.products;
    let newcart = new Cart({
        clientId: user,
        product: products,
        date: '2020-02-02'
    });
    Cart.findOne({
            clientId: user
        })
        .then((prevCart) => {
            //update previous cart
            if (prevCart) {
                prevCart.product = products;
                prevCart.save()
                    .then(() => res.status(200).json({
                        success: true,
                        msg: "Success updated.."
                    }))
                    .catch((err) => res.status(400).json({
                        success: false,
                        msg: err
                    }))
            } else {
                //add a new cart
                newcart.save()
                    .then(() => {
                        res.status(201).json({
                            success: 'true',
                            msg: 'Product Added to the Cart.!'
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            success: 'false',
                            msg: err
                        });
                    });
            }
        })

});

module.exports = router;