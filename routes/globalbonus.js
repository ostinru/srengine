var logger = require('lib/logger')(module);
var async = require('async');
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var Problem = require('models/problem').Problem;

var BONUS_KEY_WORD = "бонус";
var HINT_KEY_WORD = "подсказка";

exports.post = function (req, res, next) {
    logger.info("POST on /globalbonus " + req.body.user + " " + req.body.answer);

    User.findOne({ username: req.body.user }, function (err, user) {
        if (!user) {
            return res.sendHttpError(new HttpError(401));
        }
        var answer = req.body.answer;
        if (!answer) {
            return res.sendHttpError(new HttpError(403, "No answer"));
        }

        logger.info("user " + user.username);
        var problemId = Problem.getGlobalObjectId();

        Problem.findById(problemId, function (err, globalProblem) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }

            var problemHistory = user.getProblemHistory(problemId);
            logger.info(" bonuses " + globalProblem.bonuses);
            //
            // check bonuses
            //
            if (answer.indexOf(BONUS_KEY_WORD + ' ') == 0) {
                var bonusStr = answer.substring(BONUS_KEY_WORD.length + 1);
                logger.info(bonusStr);
                var bonus = globalProblem.checkBonuses(bonusStr);
                logger.info("bonusObject: " + bonus);
                if (bonus) {
                    logger.debug('[%s] got bonus %s', user.username, bonus.text);
                    if (!hasBonus(bonus._id, problemHistory.takenBonuses)) {
                        problemHistory.takenBonuses.push(bonus._id);
                        user.markModified('problemHistory');
                        user.save(function (err) {
                            if (err) {
                                return res.sendHttpError(new HttpError(500, err));
                            }
                            logger.info(" saved 1");
                            return res.json({ status: "Success", bonus: bonus });
                        });
                    }
                    else {
                        logger.info(" saved 2");
                        return res.json({ status: "Success", bonus: bonus });
                    }
                }
                else {
                    user.lastActivity = Date.now();
                    user.save(function (err) {
                        if (err)
                            logger.log(err);
                    });
                    return res.sendHttpError(new HttpError(404, "No such bonus '" + bonusStr + "'"));
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
                var hint = globalProblem.hints[hintNumber - 1];
                if (hint === undefined) {
                    return res.sendHttpError(new HttpError(404, "No such hint for this problem"));
                }
                logger.debug('[%s] got hint #%s', user.username, hintNumber);
                if (!hasHint(hint._id, problemHistory.takenHints)) {
                    problemHistory.takenHints.push(hint._id);
                    user.save(function (err) {
                        if (err) {
                            return res.sendHttpError(new HttpError(500, err));
                        }
                        return res.json({ status: "Success", hint: hint});
                    }); // TODO: markModified(?)
                }
                return res.json({ status: "Success", hint: hint});
            }
            else{
                return res.sendHttpError(new HttpError(404, "Херню ввел!"));
            }
        });
    });

};