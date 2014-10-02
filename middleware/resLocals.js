var config = require('../config');

module.exports = function(req, res, next) {
    res.locals.session = req.session;
    res.locals.user = req.user;
	res.locals.pageTitle = config.get('pageTitle');
    next();
};
