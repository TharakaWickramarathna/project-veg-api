const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const Products = require('../models/products');

router.get('/view', async(req, res, next) => {

    var userid = req.body.id;
    //output object
    var completeCart = {
        clientId: userid,
        productList: []
    };
    try {
        const carts = await Cart.findOne({ clientId: userid }).populate("product.productId");
        // console.log(carts);
        for (let i = 0; i < carts.product.length; i++) {
            completeCart.productList[i] = {
                _id: carts.product[i].productId._id, //details: carts.product[i],
                name: carts.product[i].productId.productName, //orderQty: carts.product[i].quantity,
                imgsrc: carts.product[i].productId.imgSrc,
                quantity: carts.product[i].quantity,
                totalPricePerItem: (carts.product[i].productId.unitPrice / carts.product[i].productId.minimumOrder) * carts.product[i].quantity,
                isPack: carts.product[i].isPack
            }
        }
        res.json(completeCart);
    } catch (e) {
        res.json({
            success: false,
            msg: "No such cart found...."
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