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
        // mongoose will create _id
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
        // mongoose will create _id
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
    // for map
    icon: String,
    iconText: String,
    iconTitle: String,
    vPoints:[
        {
            x:Number,
            y:Number
        }
    ]
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

schema.methods.getPublicFields = function(activeProblem) {
    var question = this.question;
    if (!activeProblem){
        question = undefined;
    }
    return {
        number: this.number,
        topic: this.topic,
        question: question,
        //  Latitude and Longitude
        x: this.x,
        y: this.y,
        // Icon on the map
        icon: this.icon,
        iconText: this.iconText,
        iconTitle: this.iconTitle
    };
};


exports.Problem = mongoose.model('Problem', schema);
