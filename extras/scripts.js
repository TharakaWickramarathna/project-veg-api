const _ = require('underscore');
const Product = require('../models/products')
const mongoose = require('mongoose');
const Order = require('../models/orders');
const CompletedOrder = require('../models/completedOrders')

//Generate Amount of the Pack

function getAmountOfThePack(resultingArrayFromTheDB) {
    const productList = _.pluck(resultingArrayFromTheDB, "products");
    var amounts = [];
    
    productList.forEach((item)=>{

        total =0;
        item.forEach((product)=>{
            var price =product._id.unitPrice*product.quantity;
            total += price;
           
        });
        let num = productList.indexOf(item);
        amounts[num] = total/100;
    });   
    return amounts;
}

//Favourite List Final Object Generation

function generateObject(fromThisArray, amountList,original =[]) {
    var result = [];
    this.original = original;
    var totalPackAmount = 0;
    fromThisArray.forEach((listItem)=>{
        let num = fromThisArray.indexOf(listItem);
        listItem ={
            availability: listItem.availability,
            _id: listItem._id,
            name: listItem.name,
            clientID: listItem.clientID,
            products: listItem.products,
            date: listItem.date,
            amount: amountList[num]

        }
        if(original.length !=0){
            var pack = original[num]
            pack._id = listItem
            var singlePackAmount = listItem.amount*pack.quantity
            pack.packAmount = singlePackAmount;
            totalPackAmount += singlePackAmount
        }
        result[num] = listItem;
    });
    if(original.length != 0){
        return [original, totalPackAmount];
    }
    
    return result;
}

//Suggested List Final Output Generation

function generateObjectS(fromThisArray, amountList, original=[]) {
    var result = [];
    var totalPackAmount =0;
    this.original = original;
    fromThisArray.forEach((listItem)=>{
        let num = fromThisArray.indexOf(listItem);
        var amount = amountList[num];
        let discountAmount = (listItem.discount/100) * amount;
        let total = amount - discountAmount;
        var listItem={
            availability: listItem.availability,
            _id: listItem._id,
            name: listItem.name,
            discount: listItem.discount,
            products: listItem.products,
            date: listItem.date,
            amount: amount,
            discountAmount : discountAmount,
            total: total
        }
        if(original.length != 0){
            var pack =  original[num] 
            pack._id = listItem
            var singlePackAmount = listItem.total*pack.quantity;
            pack.packAmount = singlePackAmount;
            totalPackAmount += singlePackAmount
        }  
        result[num]= listItem;

    });  
    if(original.length !=0){
        return [original,totalPackAmount]
    }
    
    return result;
    
}

//Image Source and Product creation in product.js

function productGetElement(inputArray){

    var result =[];
    inputArray.forEach(product =>{
        let num = inputArray.indexOf(product);
        const imageSource= './uploads/'+product.imgSrc;
        var item ={
            _id: product._id,
            productName: product.productName,
            unitPrice : product.unitPrice,
            minimumOrder : product.minimumOrder,
            category: product.category,
            availability : product.availability,
            imgSrc : imageSource
        }
        
        result[num] = item;
    })
    return result;
}

function createUpdateObject(requestBody){
    let item= requestBody;
    const keys = Object.keys(item);
    const values = Object.values(item);
    const passObject={};
        for (var i = 0; i<keys.length;i++){
            const key = keys[i];
            const value = values[i];
            passObject[key] = value;
        }
    return passObject; 
}

//For Order seperation of Products = v | SuggestedPacks = p | FavouritePacks = u
function orderSeperation(productListItem){
   const groupedResult=  _.groupBy(productListItem,item=>{
       return item.isPack;
   } );
   return groupedResult;
}

//Create final order object to save in the database
function orderObject(requestBody,vegetableArray, suggestedPackArray, favouritePackArray, orderTotal){
    this.requestBody =requestBody;
    this.suggestedPackArray = suggestedPackArray;
    this.favouritePackArray = favouritePackArray;
    this.orderTotal =orderTotal;
    var commision = 10;
    var deliveryCharges = 100;
    var totalAmount = (orderTotal * (100+commision)/100) + deliveryCharges;
    const order = new Order({
        _id: new mongoose.Types.ObjectId,
        clientID : requestBody.clientID,
        date: requestBody.date,
        orderAmount : orderTotal,
        deliveryCharges : deliveryCharges,
        commision : commision,
        totalAmount : totalAmount,
        natureOfOrder : requestBody.natureOfOrder,
        statusofCompletion: requestBody.statusofCompletion,
        vegetables : vegetableArray,
        featuredPacks : suggestedPackArray,
        userPacks : favouritePackArray
    })
    return order;
}

function completedOrderObject(order){
    this.order = order;

    const completedOrder = new CompletedOrder({
        _id: new mongoose.Types.ObjectId,
        clientID : order.clientID,
        orderAmount : order.orderAmount,
        deliveryCharges : order.deliveryCharges,
        commision : order.commision,
        totalAmount : order.totalAmount,
        natureOfOrder : order.natureOfOrder,
        vegetables : order.vegetables,
        featuredPacks : order.featuredPacks,
        userPacks : order.userPacks

    })
    return completedOrder
}


module.exports.getAmountOfThePack = getAmountOfThePack;
module.exports.generateObject = generateObject;
module.exports.generateObjectS = generateObjectS;
module.exports.productGetElement = productGetElement;
module.exports.createUpdateObject = createUpdateObject;
module.exports.orderSeperation = orderSeperation;
module.exports.orderObject = orderObject;
module.exports.completedOrderObject = completedOrderObject;