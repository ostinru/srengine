var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;

var BONUS_KEY_WORD = "бонус";
var HINT_KEY_WORD = "подсказка";

exports.get = function(req, res, next){
    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }

    if (!req.user) {
        return res.sendHttpError(new HttpError(401));
    }
    if (!req.user.problemId) {
        return res.sendHttpError(new HttpError(500, 'There are no probem for current user'));
    }

    var problemId = req.user.problemId;

    Problem.getProblem(problemId, function(err, problem) {
        if (err) {
            return res.sendHttpError(err); // TODO: is it ok?
        }
        var publicProblem = {
            topic : problem.topic,
            question : problem.question
        };
        
        // TODO: add bonuses and hints
        publicProblem.takenBonuses = [ "bonus 1", "bonus 2"];
        publicProblem.takenHints = ["hint 1", "hint 2"]

        res.json(publicProblem);
    });
};

exports.post = function(req, res, next) {
    logger.info('POST on "' + req.path + '": ', req.body);

    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }

    // 1) get user
    var user = req.user;
    if (!user) {
        return res.sendHttpError(new HttpError(401));
    }
    var problemId = user.problemId;
    if (!problemId) {
        return res.sendHttpError(new HttpError(500));
    }
    var answer = req.body.answer;
    if (!answer) {
        return res.sendHttpError(new HttpError(403, "No answer"));
    }

    Problem.getProblem(problemId, function (err, problem) {
        if (err) {
            return res.sendHttpError(err);
        }
        Problem.getGlobalProblem(function(err, globalProblem) {
            if (err) {
                return res.sendHttpError(err);
            }

            answer = normalizeAnswer(answer);

            if (answer.indexOf(BONUS_KEY_WORD) == 0) {
                var bonusStr = answer.substring(BONUS_KEY_WORD.length + 1);
                if (problem.checkBonuses(bonusStr)) {
                    // TODO: write bonus to user
                }
                else if (globalProblem.checkBonuses(bonusStr)) {
                    // TODO: write bonus to user
                }
                else {
                    return res.sendHttpError(new HttpError("No such bonus '"+bonusStr+"'"));
                }
            }
            else if (answer.indexOf(HINT_KEY_WORD) == 0) {
                var hintNumberStr = answer.substring(HINT_KEY_WORD.length + 1);
                var hintNumber = parseInt(hintNumberStr);
                if (isNaN(hintNumber)) {
                    return res.sendHttpError(new HttpError("Can't parse hint numer '" + hintNumberStr + "'"));
                }
                // TODO: work with only  "подсказка 2"
                var hint = problem.bonuses[hintNumber - 1];
                if (hint === undefined) {
                    return res.sendHttpError(new HttpError("No such hint for this problem"));
                }
                // TODO: write hint to user
                res.json({hint : hint});
            }
            else {
                logger.debug('checking answer "' + answer + '". Correct answers: ' + problem.answers + '. result is ' + problem.check(answer));
                if (problem.check(answer)) {
                    // TODO: set next question:
                    return res.json({}); // TODO
                }
                else if (globalProblem.check(answer)) {
                    // TODO: set next question:
                    return res.json({}); // TODO
                }
                else {
                    return res.sendHttpError(new HttpError("No such answer '" + answer + "'"));
                }
            }
        });
    });
};

normalizeAnswer = function(answer) {
    return answer;
}
