'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/controller-tests', UserController.tests);

module.exports = api;