'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Loading routes
var user_routes = require('./routes/user');

// body-parser middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Headers and Cors configuration


// Base routes
app.use('/api', user_routes);

// Exposting the created module 
// for being used in another application
module.exports = app;