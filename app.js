const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');

// connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Database Connected....") })
    .catch((error) => { console.log(error) });

// check database on
// mongoose.connection.on('connected', () => {
//     console.log("database connected " + config.database);
// });
// check database on ,error
// mongoose.connection.on('error', () => {
//     console.log("database connected fails " + config.database);
// });

const app = express();

//middleware passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/uploads', express.static('uploads'));

const users = require('./routes/users')
const products = require('./routes/products');
const cart = require('./routes/cart');
const suggestedListRoute = require('./routes/suggestedList');
const favouriteListRoute = require('./routes/favouriteList');
const orders = require('./routes/orders')

// Port Number
const PORT = process.env.PORT || 5000;
// CORS middleware
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// express session middleware
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    // store: new mongoStore({
    //     mongoseconnection: mongoose.connection
    // }),
    cookie: { maxAge: 180 * 60 * 1000 }
}))

// routers
app.use('/users', users);
app.use('/product', products);
app.use('/cart', cart);
app.use('/suggestedlist', suggestedListRoute);
app.use('/favouritelist', favouriteListRoute);
app.use('/orders', orders)

// index route
app.get('/', (req, res, next) => {
    res.send("Invalid yet");
    console.log(req.session.user) // to check my cart sessions
});

// start server
app.listen(PORT, function() {
    console.log(`server running at ` + PORT);
});