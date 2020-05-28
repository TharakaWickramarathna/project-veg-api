const _ = require('underscore');
const Product = require('../models/products')

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

function generateObject(fromThisArray, amountList) {
    var result = [];
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
        result[num] = listItem;
    });
    
    return result;
}

//Suggested List Final Output Generation

function generateObjectS(fromThisArray, amountList) {
    var result = [];
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
        result[num]= listItem;

    });    
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

//create different functions for final output generation


module.exports.getAmountOfThePack = getAmountOfThePack;
module.exports.generateObject = generateObject;
module.exports.generateObjectS = generateObjectS;
module.exports.productGetElement = productGetElement;
module.exports.createUpdateObject = createUpdateObject;
module.exports.orderSeperation = orderSeperation;
