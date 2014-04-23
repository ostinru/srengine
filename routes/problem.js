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
    Problem.findById(req.params.problemId, function(err, problem) {
        // we trust to our admins
        problem.topic = req.body.topic;
        problem.question = req.body.question;
        
        problem.answers = [];
        var i = 0;
        while (true) {
            if (req.body['answer' + i] === undefined) {
                break;
            }
            problem.answers.push(req.body['answer' + i]);
            i++;
        }
        problem.markModified('answer');
        
        problem.cost = req.body.cost;
        
        problem.bonuses = [];
        var i = 0;
        while (true) {
            if (req.body['bonus' + i] === undefined) {
                break;
            }
            problem.bonuses.push({
                text : req.body['bonus' + i],
                cost : req.body['bonus_cost' + i]
            });
            i++;
        }
        problem.markModified('bonus');
        
        problem.hints = [];
        var i = 0;
        while (true) {
            if (req.body['hint' + i] === undefined) {
                break;
            }
            problem.hints.push({
                text : req.body['hint' + i],
                cost : req.body['hint_cost' + i]
            });
            i++;
        }
        problem.markModified('hint');

        problem.save();
        res.redirect(req.get('referer'));
    });
};
