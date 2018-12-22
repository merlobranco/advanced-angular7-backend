'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});

api.get('/controller-tests', md_auth.ensureAuth, UserController.tests);
api.post('/create', UserController.create);
api.post('/login', UserController.login);
api.put('/update/:id', md_auth.ensureAuth, UserController.update);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-file/:imageFile', UserController.getImageFile);
api.get('/keepers', UserController.getKeepers);

module.exports = api;