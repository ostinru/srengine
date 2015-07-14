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

exports.post = function(req, res, next) {
    Problem.findById(req.params.problemId, function(err, problem) {
        if(!problem){
            problem =  new Problem({topic:'новое задание',
                serial:999,
                question:'Текст вопроса',
                answers:[],
                cost:0,
                hints:[],
                bonuses:[],
                _id: mongoose.Types.ObjectId(req.params.problemId)});
        }
        problem.topic = req.body.topic;
        problem.question = req.body.question;
        problem.cost = req.body.cost;
        problem.serial = req.body.serial;

        //write answers
        var i = 0;
        while (!(req.body['answer' + i] === undefined)) {
            if (i < problem.answers.length) {
                problem.answers[i] = req.body['answer' + i];
                logger.info("Updated " + problem.answers[i]);
            }
            else {
                problem.answers.push(req.body['answer' + i]);
                logger.info("Added " + problem.answers[i]);
            }
            i++;
        }
        problem.markModified('answers');

        //write bonuses
        var i = 0;
        while (!(req.body['bonus' + i] === undefined)) {
            if (i < problem.bonuses.length) {
                problem.bonuses[i].text = req.body['bonus' + i];
                problem.bonuses[i].cost = req.body['bonus_cost' + i];
            }
            else {
                problem.bonuses.push({
                    text: req.body['bonus' + i],
                    cost: req.body['bonus_cost' + i]});
            }
            i++;
        }
        problem.markModified('bonuses');

        //write hints
        var i = 0;
        while (!(req.body['hint' + i] === undefined)) {
            if (i < problem.hints.length) {
                problem.hints[i].text = req.body['hint' + i];
                problem.hints[i].cost = req.body['hint_cost' + i];
            }
            else {
                problem.hints.push({
                    text: req.body['hint' + i],
                    cost: req.body['hint_cost' + i]});
            }
            i++;
        }
        problem.markModified('hints');

        problem.save(function(err){
            if (err){
                logger.info(err);
                res.json(err);
            }
            else{
                res.redirect('problem');
            }
        });

    });
};

