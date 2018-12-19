'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/controller-tests', md_auth.ensureAuth, UserController.tests);
api.post('/create', UserController.create);
api.post('/login', UserController.login);
api.put('/update/:id',  md_auth.ensureAuth, UserController.update);

module.exports = api;