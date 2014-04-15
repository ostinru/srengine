var mongoose = require('../lib/mongoose'),
    async = require('async'),
    Schema = mongoose.Schema;

var firstPageObjectId = new mongoose.Types.ObjectId();
var lastPageObjectId = new mongoose.Types.ObjectId();
var globalObjectId = new mongoose.Types.ObjectId();

var schema = new Schema({
    topic: {
        type: String,
        unique: true,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answers: [{
        type: String,
        required: true
    }],
    cost: {
        type: Number,
        required: true
    },
    bonuses: [{
        text: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    }],
    hints: [{
        text: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    }]
});

schema.methods.check = function(userAnswer) {
    return this.answers.indexOf(userAnswer) !== -1;
};

schema.methods.checkBonuses = function(userBonus) {
    return this.bonuses.indexOf(userBonus) !== -1;
};

schema.statics.getProblem = function(problemId, callback) {
    Problem.findById(problemId).exec(callback);
};

schema.statics.getGlobalProblem = function(callback) {
    Problem.findById(globalObjectId, callback);
};

schema.statics.getFirstPageObjectId = function() {
    return firstPageObjectId;
};

schema.statics.getLastPageObjectId = function() {
    return lastPageObjectId;
};

schema.statics.getGlobalObjectId = function() {
    return globalObjectId;
};

exports.Problem = mongoose.model('Problem', schema);
