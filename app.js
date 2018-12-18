'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Loading routes

// body-parser middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Headers and Cors configuration


// body-parser routes
app.get('/test', (req, res) => {
	res.status(200).send({message : 'This is the test method'});
});


// Exposting the created module 
// for being used in another application
module.exports = app;