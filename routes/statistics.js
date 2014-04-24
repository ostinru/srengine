var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var logger = require('lib/logger')(module);
var _ = require('underscore');

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
        Problem.findById(Problem.getGlobalObjectId(),function (err, globalProblem) {
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
                        if (structProblem.solved) {
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
                            var problemTotal = problem.cost + totalBonus - totalHint;


                            history.push({'topic': problem.topic,
                                'total': problemTotal,
                                'numbBonuses': structProblem.takenBonuses.length,
                                'numbHints': structProblem.takenHints.length,
                                'solved': true,
                                'global': isGlobal(problem)});
                            return memo + problemTotal;
                        }
                        else {
                            return memo
                        }
                    }, 0);

                    //push not solved problems
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
                                'global': false});
                        }
                    });
                    //push global problem if it not solved
                    history.push({'topic': globalProblem.topic,
                        'total': 0,
                        'numbBonuses': "",
                        'numbHints': "",
                        'solved': false,
                        'global': true});

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

function isGlobal(problem){
    return (problem._id.equals(Problem.getGlobalObjectId()));
}