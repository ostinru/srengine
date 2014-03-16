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
	for (var answer in answers) {
		if (answer == userAnswer) {
			return true;
		}
	};
  return false;
};

exports.Problem = mongoose.model('Problem', schema);
