var async = require('async');
var logger = require('lib/logger')(module);
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports = function(req, res, next) {

    User.findById("5425af40aabf2aa734520402", function(err, user) {
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
                console.log(err);
            }
            else{
                console.log("user");
            }
        });

    });
};.
