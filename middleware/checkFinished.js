var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;

module.exports = function (req, res, next) {
    Problem.count({}, function (err, count) {
		var problemHistory = req.user.problemHistory;
        var lastProblemSolved = problemHistory[problemHistory.length -1].solved;
        if (count === problemHistory.length && lastProblemSolved) {
            logger.info("Finish: problemCount: = " + count + " historyLength = " + req.user.problemHistory.length);
            return res.render('finish');
        }
        else{
			next();
		}
	});
}
