var logger = require('lib/logger')();

module.exports = function (req, res, next) {

    res.sendHttpError = function (error) {
        var username = req.user && req.user.username;
        var proxy = req.headers['x-forwarded-for'] || '';
        var ip = (req.connection && req.connection.remoteAddress) ||
            (req.socket && req.socket.remoteAddress) ||
            (req.connection && req.connection.socket.remoteAddress);
        
        logger.debug('[proxy="%s", IP="%s"][%s] %s: %s', proxy, ip, username, error.status, error.message);

        res.status(error.status);
        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.render("error", {error: error});
        }
    };

    next();

};
