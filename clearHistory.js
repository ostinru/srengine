var async = require('async');
var logger = require('lib/logger')(module);
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports.post = function(req, res, next) {

    User.findById(req.params.userId, function(err, user) {
        if(!user){
         return false;
        }
        user.problemHistory=[];
        
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
};.
