'use strict'

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String
});

module.exports = mongoose.model('User', UserSchema);