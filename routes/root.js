var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('lodash');
var config = require('../config');

var checkFinished = require('middleware/checkFinished');

var BONUS_KEY_WORD = "бонус";
var HINT_KEY_WORD = "подсказка";
var SKIPPROBLEM_KEY_WORD = "автопереход";

exports.renderPage = function(req, res, next){
    return res.render("index");
}

exports.get = function(req, res, next){
    if (!req.user.problems) {
        return res.sendHttpError(new HttpError(500, 'There are no probems for current user'));
    }

    var user = req.user;
    var problems = user.problems; // populated by loadUser

    var result = _.map(problems, function(problem) {
        var activeProblem = _.find(user.problemHistory,function(activeProblem){
            return activeProblem.problem._id.equals(problem._id);
        });
        return problem.getPublicFields(activeProblem);
    })

    // TODO: remove this bullshit
    if (req.query.topic) {
        var p = _.find(result, function(problem) {
            return problem.topic === req.query.topic;
        });
        return res.json(p);
    }
    res.json(result);
};

exports.post = function(req, res, next) {
    var user = req.user;

    var answer = req.body.answer;
    answer = normalizeAnswer(answer);
    if (!answer) {
        logger.debug('[%s] empty answer', user.username);
        return res.sendHttpError(new HttpError(403, "Ответ не введен или он пустой")); //No answer
    }

    var topic = req.body.topic;

    logger.debug('[%s] send answer \'%s\' on topic \'%s\'', user.username, answer, topic);

    var ph = _.find(user.problemHistory, function(problemHistory) {
        if (problemHistory.solved) {
            return false;
        }
        return problemHistory.problem.topic == topic;
    });

    if (!ph) {
        logger.debug('[%s] problem \'%s\' not found', user.username, topic);
        return res.sendHttpError(new HttpError(404, "Задание не открыто. Необходимо приехать к маркеру на карте."));
    }

    //
    // check bonuses
    //
    if (answer.indexOf(BONUS_KEY_WORD + ' ') == 0) {
        if (checkBruteForce(user)) {
            logger.debug('[%s] banned', user.username);
            return res.sendHttpError(new HttpError(429, "Слишком много запросов, бан 3 сек")); //Too many requests
        }
        var bonusStr = answer.substring(BONUS_KEY_WORD.length + 1);
            logger.debug('[%s] send bonus \'%s\'', user.username, bonusStr);
            var problem = ph.problem;
            // find bonus
            var bonus = problem.checkBonuses(bonusStr);

            if (bonus) {
                if (!hasBonus(bonus._id, ph.takenBonuses)) {
                    ph.takenBonuses.push(bonus._id);
                    user.markModified('problemHistory');
                    user.save(function(err) {
                        if (err) {
                            return res.sendHttpError(new HttpError(500, err));
                        }
                        return res.json({ status : "Success", message: "зачислено:  " + bonusStr});
                    });
                    logger.debug('[%s] got bonus \'%s\'', user.username, bonusStr);
                    return;
                }
                else {
                    logger.debug('[%s] dup bonus \'%s\'', user.username, bonusStr);
                    return res.json({ status : "Success", message: "Уже был зачислен:  " + bonusStr});
                }
            }
            else {
                // not found:
                user.lastActivity = Date.now();
                user.save(function(err) {
                    if (err)
                        return logger.log(err);
                });
                logger.debug('[%s] no bonus \'%s\'', user.username, bonusStr);
                return res.sendHttpError(new HttpError(404, "Нет такого бонуса '"+bonusStr+"'"));//No such bonus
            }
    }
    //
    // check hints
    //
    else if (answer.indexOf(HINT_KEY_WORD) == 0) {

        var hintNumberStr = answer.substring(HINT_KEY_WORD.length + 1);
        var hintNumber = parseInt(hintNumberStr);
        if(user.availableHints == 0) {
            logger.debug('[%s] user havn\'t hints', user.username);
            return res.sendHttpError(new HttpError(400,"У вас не достаточно подсказок"));
        }
        if (isNaN(hintNumber)) {
            logger.debug('[%s] no hint \'%s\'', user.username, hintNumber);
            return res.sendHttpError(new HttpError(500, "Нет номера подсказки '" + hintNumberStr + "'"));//Can't parse hint numer
        }
        var problem = ph.problem;

        var hint = problem.hints[hintNumber - 1];
        if (hint === undefined) {
            logger.debug('[%s] no such hint \'%s\'', user.username, hintNumber);
            return res.sendHttpError(new HttpError(404, "Нет такой подсказки")); //No such hint for this problem
        }
        if (! hasHint(hint._id, ph.takenHints)) {
            ph.takenHints.push(hint._id);
            user.markModified('problemHistory');
            user.availableHints = user.availableHints - 1;
            user.save(function(err) {
                if (err) {
                    return res.sendHttpError(new HttpError(500, err));
                }
                logger.debug('[%s] got hint #%s', user.username, hintNumber);
                return res.json({ status : "Success", message: "зачислено:  " + answer});
            });
            logger.debug('[%s] got hint \'%s\'', user.username, hintNumber);
            return;
        }
        else {
            logger.debug('[%s] dup hint \'%s\'', user.username, hintNumber);
            return res.json({status: "Success", message: "Уже был зачислен:  " + answer});
        }
    }
    //
    // skip problem
    //
    else if (answer == SKIPPROBLEM_KEY_WORD) {
        logger.debug('[%s] skip problem.', user.username);
        return res.json({ status : "Success", skipProblem : true,message: "В этой игре нет автопереходов"});
        /*
        user.problemId = undefined; // be ready to do next steps
        problemHistory.timeFinish = Date.now();
        user.save(function(err) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }
            return res.json({ status : "Success", skipProblem : true,message: "зачислено:  " + answer});
        });
*/
    }
    //
    // check answer
    //
    else {
        if (checkBruteForce(user)) {
            logger.debug('[%s] banned \'%s\'', user.username, answer);
            return res.sendHttpError(new HttpError(429, "Слишком много запросов, бан 3 сек"));
        }

        var problem = ph.problem;
        var correct = !! problem.check(answer);

        logger.debug('[%s] send \'%s\' corretc: %s', user.username, answer, correct);

        if (correct) {

            logger.debug('[%s] problem \'\' answered', user.username, topic);

            ph.solved = true;
            user.markModified('problemHistory');

            user.problems = _.filter(user.problems, function(item) {
                return ! item._id.equals(problem._id);
            });

            _.each(problem.nextProblems, function(nextId) {
                // don't add duplicates:
                var hasProblem = !! _.find(user.problems, function(item) {
                    if (nextId.equals(item._id)) {
                        return item;
                    }
                });
                if (!hasProblem) {
                    user.problems.push(nextId);
                } else {
                    logger.debug('Dup problem: ' + nextId);
                }
                return true;
            });

            user.markModified('problems');

            ph.timeFinish = Date.now();

            if(problem.forHints) {
                user.availableHints = user.availableHints + 1;
            }

            user.save(function(err) {
                if (err) {
                    return res.sendHttpError(new HttpError(500, err));
                }
                return res.json({ status : "Success", correctAnswer: true, message: "зачислено:  " + answer})
            });
        }
        else {
            user.lastActivity = Date.now();
            user.save(function(err) {
                if (err)
                    logger.log(err);
            });
            logger.debug('[%s] incorrect answer \'%s\'', user.username, answer);
            return res.sendHttpError(new HttpError(404, " Ответ неверный '" + answer + "'"));//No such answer
        }
    }
};

normalizeAnswer = function(answer) {
    return answer.trim();
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

checkBruteForce = function(user) {
    var period = parseInt(config.get("bruteforcetime"));
    return user.lastActivity && (Date.now() < user.lastActivity + period*1000);
};
