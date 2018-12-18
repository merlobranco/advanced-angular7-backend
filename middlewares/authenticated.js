'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key_advaced_angular7';

exports.ensureAuth = function(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({message: 'The request does not include the header authentication value'});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try {
		var payload = jwt.decode(token, secret);

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({message: 'The provided token is expired'});
		}
	} catch (ex) {
		return res.status(404).send({message: 'The provided token is not valid'});
	}

	// Setting the a new user property inside our request
	// for using it later in all the methods of our controllers
	req.user = payload;

	// For going to the next included method in the action
	next();
};