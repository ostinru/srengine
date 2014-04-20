var logger = require('lib/logger')(module);

module.exports = function (req, res, next) {
    var username = req.user && req.user.username;
    var method = req.method;
    var path = req.path;
    var body = req.body;
    logger.debug('[%s] %s on "%s": ', username, method, path, body);
    next();
};
