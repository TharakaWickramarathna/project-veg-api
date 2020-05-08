const _ = require('underscore');
//Generate Amount of the Pack
function getAmountOfThePack(resultingArrayFromTheDB) {
    const productList = _.pluck(resultingArrayFromTheDB, "products");
    var amounts = [];
    productList.reduce((listNumber, list) => {
        const totalAmount = list.reduce((total, product) => {
            return total += product._id.unitPrice * product.quantity;
        }, 0)
        return amounts[listNumber] = totalAmount*10;
    }, 0)
    return amounts;
}

//Favourite List Final Object Generation

function generateObject(fromThisArray, amountList) {
    var result = [];
    fromThisArray.reduce((itemNumber, item) => {
        item = {
            availability: item.availability,
            _id: item._id,
            name: item.name,
            clientID: item.clientID,
            products: item.products,
            date: item.date,
            amount: amountList[itemNumber]
        }
        return result[itemNumber] = item;

    }, 0);
    return result;
}

//Suggested List Final Output Generation

function generateObjectS(fromThisArray, amountList) {
    var result = [];
    fromThisArray.reduce((itemNumber, item) => {
        item = {
            availability: item.availability,
            _id: item._id,
            name: item.name,
            discount: item.discount,
            products: item.products,
            date: item.date,
            amount: amountList[itemNumber]
        }
        return result[itemNumber] = item;

    }, 0);
    return result;
}

module.exports.getAmountOfThePack = getAmountOfThePack;
module.exports.generateObject = generateObject;
module.exports.generateObjectS = generateObjectS;