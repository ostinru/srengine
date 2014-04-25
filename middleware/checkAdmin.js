var HttpError = require('error').HttpError;
var checkAuth = require('./checkAuth');

module.exports = function(req, res, next) {
	checkAuth(req, res, function(err) {
		if (err) {
			return next(arguments);
		}

		if (!req.user.isAdmin()) {
			return next(new HttpError(403, "Access allowed only for administrators"));
		}

        next();
	});
};
