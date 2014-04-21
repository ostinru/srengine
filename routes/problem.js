var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');

exports.get = function(req, res, next){
    if (!req.params.problemId) {
        return res.sendHttpError(new HttpError(404, "problemId not set"));
    }

    Problem.findById(req.params.problemId, function(err, problem) {
        if (err) {
            return res.sendHttpError(new HttpError(404, err));
        }

        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            return res.json(problem);
        }
        else {
            res.locals.problem = problem;
            return res.render("problem");
        }
    });
};

exports.post = function(req, res, next) {
    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }
    // TODO: save problem
};
