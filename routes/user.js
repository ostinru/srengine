var async = require('async');
var logger = require('lib/logger')(module);
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports.getAllUsers = function (req, res, next) {
    User.find({})
        .populate('problems problemHistory.problem')
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
    if (!req.body.username)
        return res.sendHttpError(new HttpError(400, 'Username not specified'));
    if (!req.body.password)
        return res.sendHttpError(new HttpError(400, 'Password not specified'));
    if (!req.body.admin)
        return res.sendHttpError(new HttpError(400, '\'admin\' not specified'));

    var user =  new User({
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
        problems: [],
        problemHistory: [ {
            problem: Problem.getGlobalObjectId(),
            solved: true
        }],
        adminBonuses: [],
        _id: mongoose.Types.ObjectId(req.params.userId),
    });

    user.markModified('problemHistory');

    user.save(function(err){
        if (err){
            logger.debug(err);
            res.json(err);
        }
        else{
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

        var username = req.body.username;
        var password = req.body.password; // optional
        var admin = req.body.admin || false;

        if (username)
            user.username = username;
        if (password)
            user.password = password;
        user.admin = admin;

        if (req.body.problemHistory) {
            // FIXME: add validation?
            // FIXME: concurent modification?
            user.problemHistory = req.body.problemHistory;
            user.markModified('problemHistory');
        }


        user.save(function(err){
            if (err){
                logger.debug(err);
                res.json(err);
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
                res.json(err);
            }
            else{
                res.json({ status : "Success"});
            }
        });

    });
};

exports.addAdminBonus = exports.updateAdminBonus = function (req, res, next) {
    var userId = req.params.userId;
    if (!userId) {
        return res.sendHttpError(new HttpError(400, "UserId not specified"));
    }
    var cost = req.body.cost;
    if (!cost) {
        return res.sendHttpError(new HttpError(400, "Cost not specified"));
    }
    var message = req.body.message;
    if (!message) {
        return res.sendHttpError(new HttpError(400, "Message not specified"));
    }

    User.findById(userId, function (err, user) {
        if (!user) {
            return res.sendHttpError(new HttpError(404, "User not found"));
        }

        logger.info("user " + user.username);

        if (req.params.bonusId === undefined) {
            // new bonus
            var bonus = {
                cost: cost,
                message: message,
                id: new mongoose.Types.ObjectId()
            };
            user.adminBonuses.push(bonus);
        } else {
            // modify existing
            user.adminBonuses.forEach(function(bonus) {
                if (String(bonus.id) == String(req.params.bonusId)) {
                    bonus.cost = cost;
                    bonus.message = message;
                    return false;
                }
                return true;
            });
            // FIXME: validate that only one bonus was modified!
        }

        user.markModified('adminBonuses');

        user.save(function (err) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }
            logger.info(" saved");
            return res.json({ status: "Success", bonus: bonus });
        });

    });

};

exports.deleteAdminBonus = function (req, res, next) {
    var userId = req.params.userId;
    if (!userId) {
        return res.sendHttpError(new HttpError(400, "UserId not specified"));
    }
    if (!req.params.bonusId) {
        return res.sendHttpError(new HttpError(400, "bonusId not specified"));
    }

    User.findById(userId, function (err, user) {
        if (!user) {
            return res.sendHttpError(new HttpError(404, "User not found"));
        }

        logger.info("user " + user.username);

        user.adminBonuses = _.filter(user.adminBonuses, function(bonus) {
            return String(bonus.id) != String(req.params.bonusId);
        });
        // FIXME: validate that only one bonus was removed!

        user.markModified('adminBonuses');

        user.save(function (err) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }
            logger.info(" saved");
            return res.json({ status: "Success", bonus: bonus });
        });

    });
};
