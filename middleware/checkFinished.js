var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;

module.exports = function (req, res, next) {
    if (req.user.problems.length === 0) {
        logger.info("Finish: nothing to solve");
        if (req.headers['x-requested-with'] == 'XMLHttpRequest') {
            return res.json({status: "Success", message: 'Finished', reload: true});
        } else {
            return res.render('finish');
        }
    }
}
