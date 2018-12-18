'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key_advaced_angular7';

exports.createToken = function(user) {
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),					// Creation date
		exp: moment().add(30, 'days').unix()	// Expiration date
	};

	return jwt.encode(payload, secret);
};