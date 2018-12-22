'use strict'

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;

var AnimalSchema = Schema({
	name: String,
	description: String,
	year: Number,
	image: String,
	user: { type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Animal', AnimalSchema);