var mongoose = require('../lib/mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	topic: {
		type: String,
		unique: true,
		required: true
	},
	question: {
		type: String,
		unique: true,
		required: true
	},
	answers: [{
		type: String,
		required: true
	}],
	bonuses: [{
		type: String,
		required: false
	}],
	hints: [{
		type: String,
		required: false
	}]
});

schema.methods.check = function(userAnswer) {
	return this.answers.indexOf(userAnswer) !== -1;
};

exports.Problem = mongoose.model('Problem', schema);
