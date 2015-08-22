var HttpError = require('error').HttpError;
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var config = require('../config');
var logger = require('lib/logger')(module);
var finishTime = new Date(config.get('finishTime'));
var _ = require('underscore');
var dateFormat = require('dateformat');

exports.get = function (req, res, next) {

    //get all users
    User.find({})
        .populate('problems problemHistory.problem')
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            if (!users) {
                return next(404);
            }
            var allStatistic = [];

            //get all problems
            Problem.find({}, function (err, problems) {
                if (err) {
                    return next(err);
                }
                _.each(users, function (user) {
                    //for  one user
                    var history = [];
                    var total = _.reduce(user.problemHistory, function (memo, structProblem) {

                        var totalBonus = _.reduce(structProblem.takenBonuses, function (memo, bonus) {
                            return memo + bonus.cost;
                        }, 0);

                        var totalHint = _.reduce(structProblem.takenHints, function (memo, hint) {
                            return memo + hint.cost;
                        }, 0);

                        var problemTotal = 0;
                        if (structProblem.solved) {
                            problemTotal = structProblem.problem.cost + totalBonus - totalHint;
                        }

                        history.push({
                            'topic': structProblem.problem.topic,
                            'total': problemTotal,
                            'numbBonuses': structProblem.takenBonuses.length,
                            'numbHints': structProblem.takenHints.length,
                            'solved': structProblem.solved,
                            'timeStart': structProblem.timeStart.format("HH:MM:ss"),
                            'timeFinish': structProblem.timeFinish.format("HH:MM:ss")
                        });
                        return memo + problemTotal;
                    }, 0);

                    //push problems not in history
                    _.each(problems, function (problem) {
                        var findProblem = _.find(user.problemHistory, function (structProblem) {
                            return structProblem.problem._id.equals(problem._id);
                        });
                        if (!findProblem) {
                            history.push({
                                'topic': problem.topic,
                                'total': 0,
                                'numbBonuses': "",
                                'numbHints': "",
                                'solved': false,
                                'timeStart': finishTime.format("HH:MM:ss"),
                                'timeFinish': finishTime.format("HH:MM:ss")
                            });
                        }
                    });

                    //push admin bonuses
                    var totalAdminBonuses = _.reduce(user.adminBonuses, function(memo, bonus){
                        return memo + bonus.cost;
                    },0);
                    history.push({
                        'topic': '┗┃・ □ ・┃┛',
                        'total': totalAdminBonuses,
                        'numbBonuses': "",
                        'numbHints': "",
                        'solved': true,
                        'timeStart': finishTime.format("HH:MM:ss"),
                        'timeFinish': finishTime.format("HH:MM:ss")
                    });

                    var userStatistic = {'user': user.username, 'total': total + totalAdminBonuses, 'history': history};
                    allStatistic.push(userStatistic);
                });
                allStatistic.sort(function (a, b) {
                    return b.total - a.total
                });
                res.json({problems: problems, allStatistics: allStatistic});
            })
        })
}

Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};