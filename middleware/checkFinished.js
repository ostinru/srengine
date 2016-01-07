var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var _ = require('lodash');

module.exports = function (req, res, next) {
    var toSolve = _.reduce(req.user.problems, function(memo, problem) {
        return problem.forHints ? memo : memo + 1;
    }, 0);

    if (toSolve === 0) {
        logger.info("Finish: nothing to solve");
        if (req.headers['x-requested-with'] == 'XMLHttpRequest') {
            return res.json({status: "Success", message: 'Finished', reload: true});
        } else {
            return res.render('finish');
        }
    } else {
        next();
    }
}
