'use strict'

// Node modules
var fs = require('fs');
var path = require('path');

// Models
var User = require('../models/user');
var Animal = require('../models/animal');

// Actions
function tests(req, res) {
	res.status(200).send({
		message: 'Testing the animal controller and tests action',
		user: req.user
	});
}

module.exports = {
	tests
}