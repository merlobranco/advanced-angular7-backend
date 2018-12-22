'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'});

api.get('/animals/controller-tests', md_auth.ensureAuth, AnimalController.tests);
api.post('/animals/create', md_auth.ensureAuth, AnimalController.create);
api.get('/animals/', AnimalController.getAnimals);
api.get('/animals/:id', AnimalController.getAnimal);
api.put('/animals/:id', md_auth.ensureAuth, AnimalController.update);

module.exports = api;