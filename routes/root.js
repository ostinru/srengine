var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var _ = require('underscore');
var config = require('../config');

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
        return problem.getPublicFields(activeProblem != undefined);
    })

    res.json(result);
};

exports.post = function(req, res, next) {
    var user = req.user;

    var answer = req.body.answer;
    answer = normalizeAnswer(answer);
    if (!answer) {
        return res.sendHttpError(new HttpError(403, "Ответ не введен или он пустой")); //No answer
    }

    var topic = req.body.topic;

    var ph = _.find(user.problemHistory, function(problemHistory) {
        if (problemHistory.solved) {
            return false;
        }
        return problemHistory.problem.topic == topic;
    });

    if (!ph) {
        logger.debug('[%s] problem \'%s\' not found', user.username, topic);
        return res.sendHttpError(new HttpError(500));
    }

    //
    // check bonuses
    //
    if (answer.indexOf(BONUS_KEY_WORD + ' ') == 0) {
        if (checkBruteForce(user)) {
            return res.sendHttpError(new HttpError(429, "Слишком много запросов, бан 3 сек")); //Too many requests
        }
        var bonusStr = answer.substring(BONUS_KEY_WORD.length + 1);
            logger.debug('[%s] send bonus %s', user.username, bonus.text);
            var problem = ph.problem;
            // find bonus
            var bonus = problem.checkBonuses(bonusStr);

            if (bonus) {
                logger.debug('[%s] got bonus %s', user.username, bonus.text);
                if (!hasBonus(bonus._id, ph.takenBonuses)) {
                    ph.takenBonuses.push(bonus._id);
                    user.markModified('problemHistory');
                    user.save(function(err) {
                        if (err) {
                            return res.sendHttpError(new HttpError(500, err));
                        }
                        return res.json({ status : "Success", bonus : bonus, message: "зачислено:  " + answer});
                    });
                }
                else {
                    return res.json({ status : "Success", bonus : bonus, message: "Уже был зачислен:  " + answer});
                }
            }

        // not found:   
        user.lastActivity = Date.now();
        user.save(function(err) {
            if (err)
                return logger.log(err);
        });
        return res.sendHttpError(new HttpError(404, "Нет такого бонуса '"+bonusStr+"'"));//No such bonus
    }
    //
    // check hints
    //
    else if (answer.indexOf(HINT_KEY_WORD) == 0) {
        return res.sendHttpError(new HttpError(404, "Нет такой подсказки")); //No such hint for this problem
        /*
        var hintNumberStr = answer.substring(HINT_KEY_WORD.length + 1);
        var hintNumber = parseInt(hintNumberStr);
        if (isNaN(hintNumber)) {
            return res.sendHttpError(new HttpError(500, "Нет номера подсказки '" + hintNumberStr + "'"));//Can't parse hint numer
        }
        var hint = problem.hints[hintNumber - 1];
        if (hint === undefined) {
            return res.sendHttpError(new HttpError(404, "Нет такой подсказки")); //No such hint for this problem
        }
        logger.debug('[%s] got hint #%s', user.username, hintNumber);
        if (! hasHint(hint._id, problemHistory.takenHints)) {
            problemHistory.takenHints.push(hint._id);
            user.markModified('problemHistory');
            user.save(function(err) {
                if (err) {
                    return res.sendHttpError(new HttpError(500, err));
                }
                return res.json({ status : "Success", hint : hint, message: "зачислено:  " + answer});
            });
        }
        return res.json({ status : "Success", hint : hint, message: "Уже был зачислен:  " + answer});
        */
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
            return res.sendHttpError(new HttpError(429, "Слишком много запросов, бан 3 сек"));
        }

        var problem = ph.problem;
        var correct = !! problem.check(answer);

        if (correct) {

            logger.debug('[%s] answer problem.', user.username);

            ph.solved = true;
            user.markModified('problemHistory');

            user.problems.id(problem._id).remove();
            _.each(problem.nextProblems, function(next) {
                user.problems.push(next);
                return true;
            });
            user.markModified('problems');

            problemHistory.timeFinish = Date.now();
            user.save(function(err) {
                if (err) {
                    return res.sendHttpError(new HttpError(500, err));
                }
                return res.json({ status : "Success", correctAnswer: true,message: "зачислено:  " + answer})
            });
        }
        else {
            user.lastActivity = Date.now();
            user.save(function(err) {
                if (err)
                    logger.log(err);
            });
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
