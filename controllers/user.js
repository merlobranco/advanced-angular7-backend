'use strict'

function tests(req, res) {
	res.status(200).send({
		message: 'Testing the user controller and tests action'
	});
}

module.exports = {
	tests
};