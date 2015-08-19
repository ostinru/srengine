var mongoose = require('../lib/mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var schema = new Schema({
    number:{
        type:Number,
        unique: true,
        required: true
    },
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
    }],
    nextProblems: [{
        type: Schema.Types.ObjectId,
        required: false
    }],
    //  Latitude and Longitude
    x: Number,
    y: Number,
    // Icon on the map
    icon: String,
    iconText: String,
    iconTitle: String
});

schema.methods.check = function(userAnswer) {
    return _.find(this.answers, function(item) {
        return item == userAnswer;
    });
};

schema.methods.checkBonuses = function(userBonus) {
    return _.find(this.bonuses, function(item) {
        return item.text == userBonus;
    });
};

exports.Problem = mongoose.model('Problem', schema);
