const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const date = require('date-and-time');

const User = require('../models/users');
const config = require('../config/database');

// const now = new Date();
// let curDate = date.format(now, 'YYYY-MM-DD');

// Register
router.post('/register', function(req, res, next) {

    // create todat date

    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    let curDate = year + "-" + month + "-" + date;


    let newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        homeNumber: req.body.homeNumber,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        addressLine3: req.body.addressLine3,
        postalCode: req.body.postalCode,
        password: req.body.password,
        createdDate: curDate
    });

    User.addUser(newUser, (error, user) => {
        if (error) {
            res.status(400).json({
                success: 'false',
                msg: error + '  Failed Registration.!'
            });
            // res.send(error);
        } else {
            res.status(201).json({
                success: 'true',
                msg: 'Created Success.!'
            });
        }
    })
});

// authenticate
router.post('/authenticate', function(req, res, next) {
    res.send('auth')
});

// profile
router.get('/profile', function(req, res, next) {
    res.send('profile')
});


// get all users
router.get('/all', (req, res, next) => {
    User.find()
        .then((users) => {
            res.status(400).json({
                success: 'true',
                msg: users
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: err
            });
        });
});

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: err
            });
        });
});

// may be changed this function
router.delete('/:id', (req, res, next) => {
    User.findByIdAnd(req.params.id)
        .then(() => {
            res.status(201).json({
                success: 'true',
                msg: 'Delete Success.!'
            })
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Deleted Failed.!'
            });
        })
});


// update User
router.post('/update/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            user.fistname = req.body.fistname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.mobileNumber = req.body.mobileNumber;
            user.homeNumber = req.body.homeNumber;
            user.addressLine1 = req.body.addressLine1;
            user.addressLine2 = req.body.addressLine2;
            user.addressLine3 = req.body.addressLine3;
            user.postalCode = req.body.postalCode;
            user.password = req.body.password;
            user.createdDate = curDate;

            user.save()
                .then(() => {
                    res.status(201).json({
                        success: 'true',
                        msg: 'User Updated Success.!'
                    });
                })
        })
        .catch((err) => {
            res.status(400).json({
                success: 'false',
                msg: 'Updated Failed.!'
            });
        })
});

//login user
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                    status: false,
                    msg: 'Email does not exists..'
                })
                // console.log(user);
        }
        User.checkPassword(password, user.password, function(err, match) {
            if (err) throw err;
            if (match) {
                // res.json("matched")
                const token = jwt.sign(user.toJSON(), config.secretkey, {
                    expiresIn: 86400
                });
                req.session.user = user;
                res.json({
                    state: true,
                    token: 'jwt' + token,
                    user: {
                        id: user._id,
                        firstname: user.firstname,
                        email: user.email,
                        mobileNumber: user.mobileNumber
                    },
                    usersession: req.session.user
                });
            }
        })
    });
});



module.exports = router;