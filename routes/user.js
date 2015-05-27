var async = require('async');
var logger = require('lib/logger')(module);
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports.getAllUsers = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.json(users);
    })
};

exports.getUser = function(req, res, next){
    if (!req.params.userId) {
        return res.sendHttpError(new HttpError(404, "userId not set"));
    }

    User.findById(req.params.userId, function(err, user) {
        if (err) {
            return res.sendHttpError(new HttpError(500, err));
        }
        return res.json(user);
    });
};

var editUser = function(req, res, next) {

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
        var i = 0;
        while (!(req.body['numb' + i] === undefined)) {
            if (i < user.problemQueue.length) {
                user.problemQueue[i] = req.body['numb' + i];
            }
            else {
                user.problemQueue.push(req.body['numb' + i]);
            }
            i++;
        }
        user.markModified('problemQueue');
        if (user.problemHistory.length === 0) {
            user.problemHistory.push({problemId: Problem.getGlobalObjectId(), solved: true});
        }
        user.markModified('problemHistory');
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

exports.updateUser = editUser;
exports.createUser = editUser