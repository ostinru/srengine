var logger = require('lib/logger')(module);
var async = require('async');
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var Problem = require('models/problem').Problem;

// FIXME: произвольный бонусы + комментарий

exports.get = function(req, res, next) {
	res.status(501).end();
};

exports.post = function (req, res, next) {
    logger.info("POST on /globalbonus " + req.body.user + " " + req.body.answer);

    var answer = req.body.answer;
    if (!answer) {
        return res.sendHttpError(new HttpError(400, "No answer"));
    }

    User.findOne({ username: req.body.user }, function (err, user) {
        if (!user) {
            return res.sendHttpError(new HttpError(400, "No user"));
        }

        logger.info("user " + user.username);
        var problemId = Problem.getGlobalObjectId();

        Problem.findById(problemId, function (err, globalProblem) {
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }

            var problemHistory = user.getProblemHistory(problemId);
            logger.info(" bonuses " + globalProblem.bonuses);
            logger.info(answer);

            var bonus = globalProblem.checkBonuses(answer);
            logger.info("bonusObject: " + bonus);
            if (bonus) {
                logger.debug('[%s] got bonus %s', user.username, bonus.text);
                // allow to take bonus multiple times
                problemHistory.adminBonuses.push(bonus._id);
                user.markModified('problemHistory');
                user.save(function (err) {
                    if (err) {
                        return res.sendHttpError(new HttpError(500, err));
                    }
                    logger.info(" saved");
                    return res.json({ status: "Success", bonus: bonus });
                });
            }
            else {
                return res.sendHttpError(new HttpError(404, "No such bonus '" + answer + "'"));
            }
        });
    });

};