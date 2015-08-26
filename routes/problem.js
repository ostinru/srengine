var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var mongoose = require('lib/mongoose.js');

exports.getAllProblems = function(req, res, next){
    Problem.find({},null,{sort: {serial: 1}}, function (err, problems) {
        if (err) {
            return next(err);
        }

        return res.json(problems);
    });
};

exports.get = function(req, res, next){
    if (!req.params.problemId) {
        return res.sendHttpError(new HttpError(400, "problemId not set"));
    }

    Problem.findById(req.params.problemId, function(err, problem) {
        if (err) {
            return res.sendHttpError(new HttpError(400, err));
        }
        return res.json(problem);
    });
};

exports.createProblem = function(req, res, next) {
    // FIXME: check parameters!!
    problem =  new Problem({
        topic: req.body.topic,
        question: req.body.question,
        answers: [],
        cost: req.body.cost,
        hints: [],
        bonuses: [],
        forHints: false,
    });

    problem.save(function(err){
        if (err){
            logger.info(err);
            return res.sendHttpError(new HttpError(400, err));
        }
        else{
            return res.json({ status : "Success"});
        }
    });
};

exports.updateProblem = function(req, res, next) {
    // FIXME: check parameters!!
    Problem.findById(req.params.problemId, function(err, problem) {
        if(!problem || err){
            return res.sendHttpError(new HttpError(400, err));
        }

        var body = req.body;

        // Rely on mongoose validation
        problem.__v = body.__v;
        problem.topic = body.topic;
        
        problem.question = body.question;
        
        problem.answers = body.answers;
        problem.markModified('answers');
        
        problem.cost = body.cost;
        
        problem.bonuses = body.bonuses;
        problem.markModified('bonuses');

        problem.hints = body.hints;
        problem.markModified('hints');

        problem.nextProblems = body.nextProblems;
        problem.markModified('nextProblems');

        problem.x = body.x;
        problem.y = body.y;

        problem.icon = body.icon;
        problem.iconText = body.iconText;
        problem.iconTitle = body.iconTitle

        problem.forHints = body.forHints;

        problem.save(function(err){
            if (err){
                logger.info(err);
                return res.sendHttpError(new HttpError(400, err));
            }
            else{
                return res.json({ status : "Success"});
            }
        });

    });
};

exports.deleteProblem = function(req, res, next) {
    Problem.findById(req.params.problemId, function(err, problem) {
        if(!problem){
            return res.sendHttpError(new HttpError(400, err));
        }
        

        problem.remove(function(err){
            if (err){
                logger.debug(err);
                return res.sendHttpError(new HttpError(400, err));
            }
            else{
                return res.json({ status : "Success"});
            }
        });
    });
};
