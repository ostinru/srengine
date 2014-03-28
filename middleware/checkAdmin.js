var HttpError = require('error').HttpError;
var checkAuth = require('./checkAuth');

module.exports = function(req, res, next) {
	checkAuth(req, res, function() {
		if (arguments.length) {
			next(arguments);
		}

		if (!req.user.isAdmin()) {
			return next(new HttpError(401, "Access allowed only for administrators"));
		}

        next();
	});
};
