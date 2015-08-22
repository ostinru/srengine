var crypto = require('crypto'),
	mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');
var config = require('../config');
var defaultTime = new Date(config.get('startTime')); // FIXME: ???

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    // current availible problems
    problems: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Problem'
    }],
    problemHistory: [{
            _id: false,
            problem: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Problem'
            },
            solved: {
                type: Boolean,
                default: false
            },
            takenBonuses: [{
                type: Schema.Types.ObjectId,
                required: false
            }],
            takenHints: [{
                type: Schema.Types.ObjectId,
                required: false
            }],
            timeStart:{
                type: Date,
                default: defaultTime
            },
            timeFinish:{
                type: Date,
                default: defaultTime
            }
    }],
    adminBonuses: [{
        // mongoose will create _id
        message: {
            type: String,
            required: true
        },
        cost: {
            type:Number,
            required: true
        }
    }],
    availebleHints: {
        type:Number,
        default:0
    },
    lastActivity: Number,
    numberOfAttempts: Number
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.isAdmin = function () {
    return this.admin === true;
};

// TODO: remove or update
schema.methods.getPublicFields = function() {
    return {
        username: this.username,
        id: this.id
    };
};

schema.methods.getProblemHistory = function(problemId) {
    // return problemHistory or undefined
    return _.find(this.problemHistory, function(item) {
        return problemId.equals(item.problemId);
    });
}

exports.User = mongoose.model('User', schema);
