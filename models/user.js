var crypto = require('crypto'),
	mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');
var config = require('../config');
var Problem = require('models/problem').Problem;
var defaultTime = new Date(config.get('startTime'));

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
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    position: {
       X: {type: Number, default: 5},
       Y: {type: Number, default: 5}
    },
    problemHistory: [{
            problemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            solved: {
                type: Boolean,
                default: false
            },
            takenBonuses: [{
                type: mongoose.Schema.Types.ObjectId,
                required: false
            }],
            takenHints: [{
                type: mongoose.Schema.Types.ObjectId,
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
        }
    ],
    lastActivity : Number
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

schema.methods.getPublicFields = function() {
    return {
        username: this.username,
        created: this.created,
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
