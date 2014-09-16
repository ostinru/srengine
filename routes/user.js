var async = require('async');
var logger = require('lib/logger')(module);
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports.get = function(req, res, next){
    if (!req.params.userId) {
        return res.sendHttpError(new HttpError(404, "userId not set"));
    }

    User.findById(req.params.userId, function(err, user) {
        if (err) {
            return res.sendHttpError(new HttpError(404, err));
        }

        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            return res.json(user);
        }
        else {
            if(!user){
                logger.info("create new user");
                user =  new User({username:'юзернэйм',
                    password:'пассворд',
                    admin:false,
                    _id: mongoose.Types.ObjectId(req.params.userId)});
            }
            res.locals.user = user;
            return res.render("user");
        }
    });
};

exports.post = function(req, res, next) {

    User.findById(req.params.userId, function(err, user) {
        if(!user){
            user =  new User({username:'юзернэйм',
                password:'пассворд',
                admin:false,
                _id: mongoose.Types.ObjectId(req.params.userId)});
        }
        user.username = req.body.username;
        user.password = req.body.password;
        user.admin = req.body.admin;
        user.markModified();
        user.save(function(err){
            if (err){
                logger.debug(err);
                res.json(err);
            }
            else{
                res.redirect('user');
            }
        });

    });
};