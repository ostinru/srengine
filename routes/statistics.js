var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var config = require('../config');
var logger = require('lib/logger')(module);
var finishTime = new Date(config.get('finishTime'));
var _ = require('underscore');
var dateFormat = require('dateformat');

exports.get = function (req, res, next) {

    //get all users
    User.find({}, function (err, users) {
        if (err) {
            return next(err);
        }
        if (!users) {
            return next(404);
        }
        var allStatistic = [];

        //get global problem
        Problem.findById(Problem.getGlobalObjectId(), function (err, globalProblem) {
            if (err) return next(err);
            //get all problems
            Problem.find({}, function (err, problems) {
                if (err) {
                    return next(err);
                }

                _.each(users, function (user) {
                    //for  one user
                    var history = [];
                    var total = _.reduce(user.problemHistory, function (memo, structProblem) {

                        var problem = _.find(problems, function (problem) {
                            return structProblem.problemId.equals(problem._id);
                        });
                        var totalBonus = _.reduce(structProblem.takenBonuses, function (memo, bonusId) {
                            var bonus = _.find(problem.bonuses, function (bonus) {
                                return bonusId.equals(bonus._id);
                            });
                            return memo + bonus.cost;
                        }, 0);
                        var totalHint = _.reduce(structProblem.takenHints, function (memo, hintId) {
                            var hint = _.find(problem.hints, function (hint) {
                                return hintId.equals(hint._id);
                            });
                            return memo + hint.cost;
                        }, 0);

                        var problemTotal = 0;
                        if (structProblem.solved) {
                            problemTotal = problem.cost + totalBonus - totalHint;
                        }

                        history.push({'topic': problem.topic,
                            'total': problemTotal,
                            'numbBonuses': structProblem.takenBonuses.length,
                            'numbHints': structProblem.takenHints.length,
                            'solved': structProblem.solved,
                            'global': isGlobal(problem),
                            'timeStart':structProblem.timeStart.format("HH:MM:ss"),
                            'timeFinish':structProblem.timeFinish.format("HH:MM:ss")});
                        return memo + problemTotal;
                    }, 0);

                    //push problems not in history
                    _.each(problems, function (problem) {
                        var findProblem = _.find(user.problemHistory, function (structProblem) {
                            return structProblem.problemId.equals(problem._id);
                        });
                        if (!findProblem && !isGlobal(problem)) {
                            history.push({'topic': problem.topic,
                                'total': 0,
                                'numbBonuses': "",
                                'numbHints': "",
                                'solved': false,
                                'global': false,
                                'timeStart': finishTime.format("HH:MM:ss"),
                                'timeFinish': finishTime.format("HH:MM:ss")
                        });
                        }
                    });
                    //push global problem if it not solved
                    history.push({'topic': globalProblem.topic,
                        'total': 0,
                        'numbBonuses': "",
                        'numbHints': "",
                        'solved': false,
                        'global': true,
                        'timeStart': finishTime.format("HH:MM:ss"),
                        'timeFinish': finishTime.format("HH:MM:ss")
                    });

                    var userStatistic = {'user': user.username, 'total': total, 'history': history};
                    allStatistic.push(userStatistic);
                });
                allStatistic.sort(function (a, b) {
                    return b.total - a.total
                });
                //res.json(allStatistic);
                res.locals.problems = problems;
                res.locals.allStatistic = allStatistic;
                res.render('statistics');
            })
        });
    });
}

function isGlobal(problem) {
    return (problem._id.equals(Problem.getGlobalObjectId()));
}

Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};