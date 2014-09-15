var logger = require('lib/logger')(module);
var async = require('async');
var User = require('models/user').User;
var HttpError = require('error').HttpError;

exports.get = function (req, res, next) {
    res.render('login');
};

exports.post = function (req, res, next) {
    async.waterfall([
        function (callback) {
            User.findOne({ username: req.body.username }).exec(callback);
        },
        function (user, callback) {
            if (!user) {
                callback(new HttpError(403));
            } else {
                if (user.checkPassword(req.body.password)) {
                    callback(null, user);
                } else {
                    callback(new HttpError(403));
                }
            }
        }
    ],
    function (err, user) {
        if (err) {
            return next(err);
        }

        req.session.user = user._id;
        if(user.isAdmin()){
            res.redirect("/administration")
        }
        else {
            res.redirect("/map");
        }
    });

};

