'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Loading routes
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

// body-parser middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Headers and Cors configuration
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Base routes
app.use('/api', user_routes);
app.use('/api', animal_routes);

// Exposting the created module 
// for being used in another application
module.exports = app;