'use strict'

// Node modules
var bcrypt = require('bcrypt-nodejs');

// Models
var User = require('../models/user');

// Jwt Service
var jwt = require('../services/jwt');


// Actions
function tests(req, res) {
	res.status(200).send({
		message: 'Testing the user controller and tests action',
		user: req.user
	});
}

function create(req, res) {
	// Creating User Object
	var user = new User();

	// Getting the received parameters
	var params = req.body;

	if(params.name && params.surname && params.email && params.password) {
		// Setting User property values
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		User.findOne({email: user.email.toLowerCase()}, (err, isSetUser) => { 
			if (err) {
				res.status(500).send({message: 'Thrown error while checking if the user exists'});
			} else {
				if (!isSetUser) {
					// Encrypting the password
					bcrypt.hash(params.password, null, null, function(err, hash) {
						user.password = hash;

						// Saving the user
						user.save((err, userStored) => {
							if (err) {
								res.status(500).send({message: 'Thrown error while creating the user'});
							} else {
								if (!userStored) {
									res.status(404).send({message: 'User has not been created'});
								} else {
									res.status(200).send({user: userStored});
								}
							}
						});
					});
				} else {
					res.status(200).send({message: 'The user cannot be created because already exists'});
				}
			}
		});

		
	} else {
		res.status(200).send({message: 'Please provide the required User data'});
	}
}

function login(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => { 
			if (err) {
				res.status(500).send({message: 'Thrown error while checking if the user exists'});
			} else {
				if (user) {
					bcrypt.compare(password, user.password, (err, check) => {
						if (check) {
							// Checking and generating token
							if (params.gettoken) {
								res.status(200).send({
									token: jwt.createToken(user)
								});
							} else {
								res.status(200).send({user});
							}
						} else {
							res.status(404).send({message: 'The provided user could not be logged'});
						}
					});
					
				} else {
					res.status(404).send({message: 'The provided user does not exist'});
				}
			}
		});
}

module.exports = {
	tests,
	create,
	login
};