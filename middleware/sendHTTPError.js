var logger = require('lib/logger')(module);

module.exports = function (req, res, next) {

    res.sendHttpError = function (error) {
        var username = req.user && req.user.username;
        logger.debug('[%s] %s: %s', username, error.status, error.message);

        res.status(error.status);
        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.render("error", {error: error});
        }
    };

    next();

};
