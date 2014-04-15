var crypto = require('crypto');
var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

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
    currentProblemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    position: {
       X: {type: Number, default: 8},
       Y: {type: Number, default: 16}
    },
    problemHistory: [{
            problemID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            takenBonuses: [{
                type: mongoose.Schema.Types.ObjectId,
                required: false
            }],
            takenHints: [{
                type: mongoose.Schema.Types.ObjectId,
                required: false
            }]
        }
    ]
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

exports.User = mongoose.model('User', schema);
