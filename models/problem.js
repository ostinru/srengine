var mongoose = require('lib/mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

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
    forHints:{
        type: Boolean,
        default: false
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
            _id: false,
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

//activeProblem - instance of problemHistory
schema.methods.getPublicFields = function(activeProblem) {
    var question = this.question;
    var vPoints = this.vPoints;

    var hints = [];
    if (activeProblem==undefined){
        question = undefined;
        vPoints = undefined;
    }else{
        hints = _.filter(this.hints, function(hint) {
            return _.find(activeProblem.takenHints, function (takenHintId) {
                return takenHintId.equals(hint._id);
            });
        });
        hints = _.map(hints, function(hint) {
            return hint.text;
        })
    }

    return {
        topic: this.topic,
        question: question,
        //  Latitude and Longitude
        x: this.x,
        y: this.y,
        //
        hints:hints,
        // Icon on the map
        icon: this.icon,
        iconText: this.iconText,
        iconTitle: this.iconTitle,
        vPoints: vPoints
    };
};


exports.Problem = mongoose.model('Problem', schema);
