var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');

var BONUS_KEY_WORD = "бонус";
var HINT_KEY_WORD = "подсказка";
var SKIPPROBLEM_KEY_WORD = "автопереход";

exports.get = function(req, res, next){
    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.redirect("/map");
    }

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
            return res.sendHttpError(new HttpError(404, err)); // TODO: is it ok?
        }

        var publicProblem = {
            topic : problem.topic,
            question : problem.question
        };

        var problemHistory = user.getProblemHistory(problemId);

        // add bonuses
        var bonusesIds = problemHistory && _.filter(problem.bonuses, function(item) {
            return _.find(problemHistory.takenBonuses, function(bonusId) {
                return bonusId.equals(item._id); });
        });
        publicProblem.takenBonuses = inlinePublicBonuses(bonusesIds, problem.bonuses);
        
        // add hints
        var hintsIds = problemHistory && _.filter(problem.hints, function(item, cb) {
            return _.find(problemHistory.takenHints,   function(hintId)  { return hintId.equals(item._id); });
        });
        publicProblem.takenHints = inlinePublicHints(hintsIds, problem.hints);

        res.json(publicProblem);
    });
};

exports.post = function(req, res, next) {
    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }

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
            return res.sendHttpError(new HttpError(500, err));
        }
        Problem.getGlobalProblem(function(err, globalProblem) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }

            var problemHistory = user.getProblemHistory(problemId);
            answer = normalizeAnswer(answer);
            //
            // check bonuses
            //
            if (answer.indexOf(BONUS_KEY_WORD + ' ') == 0) {
                var bonusStr = answer.substring(BONUS_KEY_WORD.length + 1);
                var bonus = problem.checkBonuses(bonusStr) || globalProblem.checkBonuses(bonusStr);
                if (bonus) {
                    logger.debug('[%s] got bonus %s', user.username, bonus.text);
                    if (!hasBonus(bonus._id, problemHistory.takenBonuses)) {
                        problemHistory.takenBonuses.push(bonus._id);
                        user.markModified('problemHistory');
                        user.save(function(err) {
                            if (err) {
                                return res.sendHttpError(new HttpError(500, err));
                            }
                            return res.json({ status : "Success", bonus : bonus });
                        });
                    }
                    else {
                        return res.json({ status : "Success", bonus : bonus });
                    }
                }
                else {
                    return res.sendHttpError(new HttpError(404, "No such bonus '"+bonusStr+"'"));
                }
            }
            //
            // check hints
            //
            else if (answer.indexOf(HINT_KEY_WORD) == 0) {
                var hintNumberStr = answer.substring(HINT_KEY_WORD.length + 1);
                var hintNumber = parseInt(hintNumberStr);
                if (isNaN(hintNumber)) {
                    return res.sendHttpError(new HttpError(500, "Can't parse hint numer '" + hintNumberStr + "'"));
                }
                var hint = problem.hints[hintNumber - 1];
                if (hint === undefined) {
                    return res.sendHttpError(new HttpError(404, "No such hint for this problem"));
                }
                logger.debug('[%s] got hint #%s', user.username, hintNumber);
                if (! hasHint(hint._id, problemHistory.takenHints)) {
                    problemHistory.takenHints.push(hint._id);
                    user.save(function(err) {
                        if (err) {
                            return res.sendHttpError(new HttpError(500, err));
                        }
                        return res.json({ status : "Success", hint : hint});
                    }); // TODO: markModified(?)
                }
                return res.json({ status : "Success", hint : hint});
            }
            //
            // skip problem
            //
            else if (answer == SKIPPROBLEM_KEY_WORD) {
                logger.debug('[%s] skip problem.', user.username);
                user.problemId = undefined; // be ready to do nest steps
                problemHistory.timeFinish = Date.now();
                user.save(function(err) {
                    if (err) {
                        return res.sendHttpError(new HttpError(500, err));
                    }
                    return res.json({ status : "Success", skipProblem : true});
                });
            }
            //
            // check answer
            //
            else {
                if (problem.check(answer)) {
                    logger.debug('[%s] answer problem.', user.username);
                    problemHistory.solved = true;
                    user.markModified('problemHistory');
                    user.problemId = undefined; // be ready to do nest steps
                    problemHistory.timeFinish = Date.now();
                    user.save(function(err) {
                        if (err) {
                            return res.sendHttpError(new HttpError(500, err));
                        }
                        return res.json({ status : "Success", correctAnswer: true})
                    });
                }
                else {
                    return res.sendHttpError(new HttpError(404, "No such answer '" + answer + "'"));
                }
            }
        });
    });
};

normalizeAnswer = function(answer) {
    return answer;
};

inlinePublicBonuses = function(bonuses) {
    return _.map(bonuses, function(bonus) {
        return {
            text: bonus.text,
            cost: bonus.cost
        };
    });
};

inlinePublicHints = function(hints) {
    return _.map(hints, function(hint) {
        return {
            text: hint.text,
            cost: hint.cost
        };
    });
};

hasBonus = function(bonusId, takenBonuses) {
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
