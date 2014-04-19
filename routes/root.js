var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');

var BONUS_KEY_WORD = "бонус";
var HINT_KEY_WORD = "подсказка";
var SKIPPROBLEM_KEY_WORD = "автопереход";

exports.get = function(req, res, next){
    /*if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }*/

    if (!req.user) {
        return res.sendHttpError(new HttpError(401));
    }
    if (!req.user.problemId) {
        return res.sendHttpError(new HttpError(500, 'There are no probem for current user'));
    }

    var user = req.user;
    var problemId = user.problemId;

    Problem.findById(problemId, function(err, problem) {
        if (err) {
            return res.sendHttpError(err); // TODO: is it ok?
        }

        var problemHistory = user.getProblemHistory(problemId);

        var publicProblem = {
            topic : problem.topic,
            question : problem.question
        };
        publicProblem.takenBonuses = problemHistory && _.filter(problem.bonuses, function(item) {
            _.find(problemHistory.bonuses, function(bonusId) { return bonusId.equals(item._id); });
        });
        publicProblem.takenHints = problemHistory && _.filter(problem.hints, function(item, cb) {
            _.find(problemHistory.hints,   function(hintId)  { return hintId.equals(item._id); });
        });

        if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
            res.locals.problem = publicProblem;
            return res.render('index');
        }
        res.json(publicProblem);
    });
};

exports.post = function(req, res, next) {
    logger.info('POST on "' + req.path + '": ', req.body);
/*
    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }
*/
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

    Problem.findById(problemId, function (err, problem) {
        if (err) {
            return res.sendHttpError(err);
        }
        Problem.getGlobalProblem(function(err, globalProblem) {
            if (err) {
                return res.sendHttpError(err);
            }

            var problemHistory = user.getProblemHistory(problemId);
            answer = normalizeAnswer(answer);
            //
            // check bonuses
            //
            if (answer.indexOf(BONUS_KEY_WORD) == 0) {
                var bonusStr = answer.substring(BONUS_KEY_WORD.length + 1);
                var bonus = problem.checkBonuses(bonusStr) || globalProblem.checkBonuses(bonusStr);
                if (bonus) {
                    logger.debug('User %s got bonus %s', user.username, bonus.text);
                    if (!hasBonus(bonus._id, problemHistory.takenBonuses)) {
                        problemHistory.takenBonuses.push(bonus._id);
                        user.markModified('problemHistory');
                        user.save(function(err) {
                            if (err) {
                                res.json(err);
                            }
                            res.json(bonus);
                        });
                    }
                    else {
                        res.json({});
                    }
                }
                else {
                    return res.sendHttpError(new HttpError("No such bonus '"+bonusStr+"'"));
                }
            }
            //
            // check hints
            //
            else if (answer.indexOf(HINT_KEY_WORD) == 0) {
                var hintNumberStr = answer.substring(HINT_KEY_WORD.length + 1);
                var hintNumber = parseInt(hintNumberStr);
                if (isNaN(hintNumber)) {
                    return res.sendHttpError(new HttpError("Can't parse hint numer '" + hintNumberStr + "'"));
                }
                var hint = problem.hints[hintNumber - 1];
                if (hint === undefined) {
                    return res.sendHttpError(new HttpError("No such hint for this problem"));
                }
                if (! hasHint(hint._id, problemHistory.takenHints)) {
                    problemHistory.takenHints.push(hint._id);
                    user.save(); // TODO: markModified(?)
                }
                res.json({hint : hint});
            }
            //
            // skip problem
            //
            else if (answer == SKIPPROBLEM_KEY_WORD) {
                logger.debug('User %s skip problem.', user.username);
                user.problemId = undefined; // be ready to do nest steps
                user.save(function(err) {
                    if (err) {
                        res.json(err);
                    }
                    res.json({})
                });
            }
            //
            // check answer
            //
            else {
                logger.debug('checking answer "' + answer + '". Correct answers: ' + problem.answers + '. result is ' + !! problem.check(answer));
                if (problem.check(answer)) {
                    problemHistory.solved = true;
                    user.markModified('problemHistory');
                    user.problemId = undefined; // be ready to do nest steps
                    user.save(function(err) {
                        if (err) {
                            res.json(err);
                        }
                        res.json({})
                    });
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
};

hasBonus = function(bonusId, takenBonuses) {
	logger.debug('loocking for %s in', bonusId, takenBonuses);
    return !! _.find(takenBonuses, function(item) {
        if (bonusId.equals(item)) {
            return item;
        }
    });
};

hasHint = function(hintId, takenHints) {
    return !! _.find(takenHints, function(item) {
        if (hintId.equals(item)) {
            return item;
        }
    });
};
