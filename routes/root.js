var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;

exports.get = function(req, res, next){
    if (!req.user) {
        res.sendHttpError(new HttpError(401));
        return;
    }
    if (!req.user.problemId) {
        res.sendHttpError(new HttpError(500));
        return;
    }


    var problemId = req.user.problemId;

    getProblem(problemId, function(err, problem) {
        if (err) {
            res.sendHttpError(err); // TODO: is it ok?
            return;
        }
        res.locals.problem = problem;
        res.render('index');
    });
};

exports.post = function(req, res, next){
    logger.info('POST on "' + req.path + '": ', req.body);
    if (!req.body.answer) {
        // TODO: fail
    }
    // 1) get user
    var user = req.user;
    if (!user) {
        res.sendHttpError(new HttpError(401));
        return;
    }
    if (!user.problemId) {
        res.sendHttpError(new HttpError(500));
        return;
    }

    var problemId = user.problemId;

    // 2) get problem
    getProblem(problemId, function (err, problem) {
        if (err) {
            res.sendHttpError(err); // TODO: is it ok?
            return;
        }
        // 3) check
        if (problem.answers) {
            // it was stub.
            // TODO: set next question:
            // TODO: reload page?
            return;
        }
        res.locals.problem = problem;
        res.render('index');
    });
};

// TODO: rename function
function getProblem(problemId, callback) {
    logger.debug('Looking for problemID ' + problemId);
    async.waterfall([
        function (callback) {
            Problem.findOne({ _id : problemId }).exec(callback);
        },
        function (problem, callback) {
            if (!problem) {
                callback(new HttpError(403), null);
                return;
            }
            callback(null, problem);
        }
    ],
        function(err, problem) {
            if (err) {
                logger.error("GET PROBLEM:", err);
                callback(err, null);
                return;
            }
            callback(null, problem);
        }
    );
}
