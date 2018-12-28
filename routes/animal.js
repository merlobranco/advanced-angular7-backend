'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'});

api.get('/animals/controller-tests', md_auth.ensureAuth, AnimalController.tests);
api.get('/animals', AnimalController.getAnimals);
api.get('/animals/:id', AnimalController.getAnimal);
api.post('/animals', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.create);
api.put('/animals/:id', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.update);
api.delete('/animals/:id', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.remove);

api.post('/animals/upload-image/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], AnimalController.uploadImage);
api.get('/animals/get-image-file/:imageFile', AnimalController.getImageFile);
api.delete('/animals/image-file/:imageFile', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.deleteImageFile);

module.exports = api;