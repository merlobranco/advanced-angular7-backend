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

function create(req, res) {
	var animal = new Animal();

	var params = req.body;

	if (params.name) {
		animal.name = params.name;
		animal.description = params.description;
		animal.year = params.year;
		animal.image = null;
		animal.user = req.user.sub; // Getting the logged user, stored in the JWT
	
		Animal.findOne({name: animal.name}, (err, isSetAnimal) => {
			if (err) {
				res.status(500).send({message: 'Thrown error while checking if the animal exists'});
			} else {
				//If the animal has not been found
				if (!isSetAnimal) {
					animal.save((err, animalStored) => {
						if (err) {
							res.status(500).send({message: 'Thrown error while creating the animal'});
						} else {
							if (!animalStored) {
								res.status(404).send({message: 'Animal has not been created'});
							} else {
								res.status(200).send({animal: animalStored});
							}
						}
					});
				} else {
					res.status(200).send({message: 'The animal cannot be created because already exists'});
				}
			}
		});
	} else {
		res.status(200).send({message: 'Please provide the required Animal data (name)'});
	}
}

module.exports = {
	tests,
	create
}