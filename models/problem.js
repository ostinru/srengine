var mongoose = require('../lib/mongoose'),
    _ = require('underscore'),
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
    return _.find(this.answers, function(item) {
        return item == userAnswer;
    });
};

schema.methods.checkBonuses = function(userBonus) {
    return _.find(this.bonuses, function(item) {
        return item == userAnswer;
    });
};

schema.statics.getGlobalProblem = function(callback) {
    this.findById(globalObjectId, callback);
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
