var logger = require('lib/logger')(module);
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var mongoose = require('lib/mongoose.js');

exports.get = function(req, res, next){
    User.find({},null,{sort: {username: 1}}, function (err, users) {
        if (err) {
            return next(err);
        }

        if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
            res.locals.users = users;
            return res.render('users');
        }
        else {
            return res.json(users);
        }
    });
};

exports.post = function(req,res,next) {
    var pathProblem = '/user/' + mongoose.Types.ObjectId();
    res.redirect(pathProblem);
}