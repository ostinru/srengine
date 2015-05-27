var morgan = require('morgan'); // logger

module.exports = function (req, res, next) {

    var username = req.user && req.user.username;
    var method = req.method;
    var path = req.path;
    var body = req.body;
    var proxy = req.headers['x-forwarded-for'] || '';
    var ip = (req.connection && req.connection.remoteAddress) ||
        (req.socket && req.socket.remoteAddress) ||
        (req.connection && req.connection.socket.remoteAddress);

    if (path != '/message') {
        logger.debug('[proxy="%s", IP="%s"][%s] %s on "%s": ', proxy, ip, username, method, path, body);
    }

    next();
};
