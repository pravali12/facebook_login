const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const passport = require('passport');
const  session = require('express-session');
const  subdomain = require('express-subdomain');


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
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
  }));
  
app.use(passport.initialize());
app.use(passport.session());

//Middleware
app.use('/', router);
router.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.locals.currentUser = req.user;
    next();
});


//Route variables

const facebook= require('./routes/user/api');
//Routing
//app.use('/',index);
app.use(subdomain('*', facebook));
//app.use('/',facebook);

module.exports = app;
