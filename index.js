'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo', {useNewUrlParser: true})
	.then(() => {
		console.log('The connection to the database was successful...');
		
		app.listen(port, () => {
			console.log('The Local Server with Node and Express is running successfully...')
		});
	})
	.catch(err => console.log(err));
