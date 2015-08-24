var async = require('async');
var logger = require('lib/logger')(module);
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports.getAllUsers = function (req, res, next) {
    User.find({})
        .exec(function (err, users) {
            if (err) return next(err);
            res.json(users);
        });
};

exports.getUser = function(req, res, next){
    if (!req.params.userId) {
        return res.sendHttpError(new HttpError(400, "userId not set"));
    }

    User.findById(req.params.userId)
        .populate('problems problemHistory.problem')
        .exec(function(err, user) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }
            return res.json(user);
        });
};

exports.createUser = function(req, res, next) {
    if (typeof req.body.username === 'undefined')
        return res.sendHttpError(new HttpError(400, 'Username not specified'));
    if (typeof req.body.password === 'undefined')
        return res.sendHttpError(new HttpError(400, 'Password not specified'));
    if (typeof req.body.admin === 'undefined')
        return res.sendHttpError(new HttpError(400, '\'admin\' not specified'));

    logger.debug('CreateUser: ', req.body);

    var user = new User({
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
        problems: [],
        problemHistory: [],
        adminBonuses: [],
        availebleHints: 0,
        lastActivity: 0,
        numberOfAttempts: 0
    });

    user.save(function(err){
        if (err){
            logger.debug(err);
            res.sendHttpError(new HttpError(400, '' + err.name + ' - ' + err.message));
        }
        else{
            logger.debug('CreateUser OK:', req.body);
            res.json({ status : "Success"});
        }
    });
};

exports.updateUser = function(req, res, next) {
    if (!req.params.userId) {
        return res.sendHttpError(new HttpError(400, "userId not set"));
    }

    User.findById(req.params.userId, function(err, user) {
        if (err) {
            return res.sendHttpError(new HttpError(400, "User with id = '" + req.params.userId + "'' not found"));
        }

        user.__v = req.body.__v;
        user.username = req.body.username;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.admin = req.body.admin || false;
        user.problems = req.body.problems;
        if (req.body.problemHistory) {
            user.problemHistory = req.body.problemHistory;
            user.markModified('problemHistory');
        }
        user.adminBonuses = req.body.adminBonuses;
        user.markModified('adminBonuses');
        user.availebleHints = req.body.availebleHints;
        user.markModified('availebleHints');
        // takenHints
        // timeStart
        // timeFinishs

        user.save(function(err){
            if (err){
                logger.debug(err);
                res.sendHttpError(new HttpError(400, err));
            }
            else{
                res.json({ status : "Success"});
            }
        });

    });
};

exports.deleteUser =  function(req, res, next) {
    if (!req.params.userId) {
        return res.sendHttpError(new HttpError(400, "userId not set"));
    }

    User.findById(req.params.userId, function(err, user) {
        if (err) {
            return res.sendHttpError(new HttpError(400, "User with id = '" + req.params.userId + "'' not found"));
        }

        user.remove(function(err){
            if (err){
                logger.debug(err);
                res.sendHttpError(new HttpError(400, err));
            }
            else{
                res.json({ status : "Success"});
            }
        });

    });
};
