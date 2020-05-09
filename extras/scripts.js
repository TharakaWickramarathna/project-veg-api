const _ = require('underscore');

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
        amounts[num] = total*10;
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
        listItem={
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

module.exports.getAmountOfThePack = getAmountOfThePack;
module.exports.generateObject = generateObject;
module.exports.generateObjectS = generateObjectS;