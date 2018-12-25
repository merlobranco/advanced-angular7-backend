'use strict'

// Node modules
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

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
		user.email = params.email.toLowerCase();
		user.role = 'ROLE_USER';
		user.image = null;

		User.findOne({email: user.email}, (err, isSetUser) => { 
			if (err) {
				res.status(500).send({message: 'Thrown error while checking if the user exists'});
			} else {
				if (!isSetUser) {
					// Encrypting the password
					bcrypt.hash(params.password, null, null, (err, hash) => {
						if (err) {
							res.status(500).send({message: 'Thrown error while encrypting the user password'});
						} else {
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
						}
					});
				} else {
					res.status(200).send({message: 'The user cannot be created because already exists'});
				}
			}
		});

		
	} else {
		res.status(200).send({message: 'Please provide the required User data (name, surname, email, password)'});
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
							user.password = '';
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

function update(req, res) {
	var userId = req.params.id;
	var update = req.body;

	// Checking that the user to be updated is not the logged user
	if (userId != req.user.sub) {
		return res.status(500).send({message: 'You do not have permission for updating the provided user'});
	}

	User.findByIdAndUpdate(userId, {name: update.name, surname: update.surname, email: update.email}, {new: true}, (err, userUpdated) => {
		if (err) {
			res.status(500).send({message: 'Thrown error while updating user'});
		} else {
			if (!userUpdated) {
				res.status(404).send({message: 'The user could not be updated'});
			} else {
				userUpdated.password = '';
				res.status(200).send({ user: userUpdated });
			}
		}
	});	
}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name = 'no uploaded';

	if(req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			if (userId != req.user.sub) {
				return res.status(500).send({message: 'You do not have permission for updating the provided user'});
			}

			User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
				if (err) {
					res.status(500).send({message: 'Thrown error while updating user'});
				} else {
					if (!userUpdated) {
						res.status(404).send({message: 'The user could not be updated'});
					} else {
						res.status(200).send({ user: userUpdated, image: file_name });
					}
				}
			});
		} else {
			// Deleting no valid files
			fs.unlink(file_path, (err) => {
				if (err) {
					res.status(200).send({message: 'No valid file extension. File not deleted'});
				} else {
					res.status(200).send({message: 'No valid file extension. Should be png, jpg, jpeg or gif'});
				}
			});
		}
	} else {
		res.status(200).send({message: 'No files has been uploaded'});
	}
}

function getImageFile(req, res) {
	var image_file = req.params.imageFile;
	var path_file = './uploads/users/' + image_file;

	fs.exists(path_file, function(exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(404).send({message: 'The requested image does not exist'});
		}
	})
}

function getKeepers(req, res) {
	User.find({role:'ROLE_ADMIN'}).exec((err, users) => {
		if (err) {
			res.status(500).send({message: 'Thrown error while requesting the keepers'});
		} else {
			if (!users) {
				res.status(404).send({message: 'There are not keepers'});
			} else {
				res.status(200).send({users});	
			}
		}
	});
}

module.exports = {
	tests,
	create,
	login,
	update,
	uploadImage,
	getImageFile,
	getKeepers
};