const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    firstname: {
        type: String
            // required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    homeNumber: {
        type: String,
        required: false
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: true
    },
    addressLine3: {
        type: String
            // required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findOne(id, callback);
}
module.exports.findByEmail = function(email, callback) {
    const query = { email: email };
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.checkPassword = function(password, hashpassword, callback) {
    bcrypt.compare(password, hashpassword, function(err, res) {
        if (err) throw err;
        if (res) {
            callback(null, res);
            // console.log(res);
        }
    });
};