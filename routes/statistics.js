var HttpError = require('error').HttpError;
var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var config = require('../config');
var logger = require('lib/logger')(module);
var startTime = new Date(config.get('startTime'));
var _ = require('underscore');
var dateFormat = require('dateformat');

exports.get = function (req, res, next) {

    //get all users
    User.find({})
        .populate('problemHistory.problem')
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
                    var lastProblemTimestamp = startTime;
                    var total = _.reduce(user.problemHistory, function (memo, structProblem) {
                        var status = 'activate';
                        var totalBonus = _.reduce(structProblem.takenBonuses, function (memo, bonusId) {
                            var bonus = _.find(structProblem.problem.bonuses, function (bonus) {
                                return bonusId.equals(bonus._id);
                            });
                            return memo + ((bonus===undefined) ? 0 : bonus.cost);
                        }, 0);

                        var totalHint = _.reduce(structProblem.takenHints, function (memo, hintId) {
                            var hint = _.find(structProblem.problem.hints, function (hint) {
                                return hintId.equals(hint._id);
                            });
                            return memo + ((hint.cost===undefined) ? 0 : hint.cost);
                        }, 0);

                        var problemTotal = 0;
                        if (structProblem.solved) {
                            problemTotal = structProblem.problem.cost + totalBonus - totalHint;
                            status = 'agreed';
                           if (structProblem.timeFinish > lastProblemTimestamp){
                                lastProblemTimestamp = structProblem.timeFinish;
                            }
                         }

                        history.push({
                            'topic': structProblem.problem.topic,
                            'total': problemTotal,
                            'numbBonuses': structProblem.takenBonuses.length,
                            'numbHints': structProblem.takenHints.length,
                            'solved': structProblem.solved,
                            'status': status,// notavailable, available, activate, agreed
                            'timeStart': structProblem.timeStart.format("dd.mm.yy HH:MM:ss"),
                            'timeFinish': structProblem.timeFinish.format("dd.mm.yy HH:MM:ss")
                        });
                        return memo + problemTotal;
                    }, 0);

                    //push problems not in history
                    _.each(problems, function (problem) {
                        var findProblem = _.find(user.problemHistory, function (structProblem) {
                            return structProblem.problem._id.equals(problem._id);
                        });
                        if (!findProblem) {
                            var status = 'notavailable';
                            var isAvailable = _.find(user.problems, function (availableProblemId) {
                                return availableProblemId.equals(problem._id);
                            });
                            if (isAvailable){
                                status = 'available';
                            }
                            history.push({
                                'topic': problem.topic,
                                'total': 0,
                                'numbBonuses': 0,
                                'numbHints': 0,
                                'solved': false,
                                'status': status,
                                'timeStart': startTime.format("dd.mm.yy HH:MM:ss"),
                                'timeFinish': startTime.format("dd.mm.yy HH:MM:ss")
                            });
                        }
                    });

                    history.sort(function(a,b){
                        if (a.topic > b.topic)
                            return 1;
                        else if (a.topic < b.topic)
                            return -1;
                        else
                            return 0;
                    });

                    //push admin bonuses
                    var totalAdminBonuses = _.reduce(user.adminBonuses, function(memo, bonus){
                        return memo + bonus.cost;
                    },0);
                    history.push({
                        'topic': '   ',
                        'total': totalAdminBonuses,
                        'numbBonuses': 0,
                        'numbHints': 0,
                        'solved': true,
                        'status': 'available',
                        'timeStart': startTime.format("dd.mm.yy HH:MM:ss"),
                        'timeFinish': startTime.format("dd.mm.yy HH:MM:ss")
                    });

                    var userStatistic = {
                        'user': user.username,
                        'total': total + totalAdminBonuses,
                        'history': history,
                        'timeFinish':lastProblemTimestamp,
                        'publicTimeFinish':lastProblemTimestamp.format("dd.mm.yy HH:MM:ss"),
                        'availableHints':user.availableHints
                    };
                    allStatistic.push(userStatistic);
                });
                allStatistic.sort(function (a, b) {
                    if(a.total > b.total){
                        return -1;
                    }
                    if(a.total < b.total){
                        return 1;
                    }
                    if(a.total === b.total){
                        if(a.timeFinish > b.timeFinish){
                            return 1;
                        }
                        if(a.timeFinish < b.timeFinish){
                            return -1;
                        }
                    }
                    return 0;
                });
                res.json({problems: problems, allStatistics: allStatistic});
            })
        })
}

Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};