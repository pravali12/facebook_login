const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use('/', router);
router.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.locals.currentUser = req.user;
    next();
});

app.get("/getlogin",function(req,res){

    res.render("login");

});
app.get("/addcart",function(req,res){

    res.render("addcart");

});

//Route variables
const index = require('./routes/index');
// const products= require('./routes/product/api');
// const plans = require('./routes/plans/api');
// const orders= require('./routes/order/api');
// const cart= require('./routes/cart/api');
const users= require('./routes/user/api');
//Routing
app.use('/',index);
// app.use('/api/products',products);
// app.use('/api/plans',plans);
// app.use('/api/orders',orders);
// app.use('/api/cart',cart);
app.use('/api/users',users);

module.exports = app;
