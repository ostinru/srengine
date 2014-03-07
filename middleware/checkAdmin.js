var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    if (!req.session.user) {
        return next(new HttpError(401, "Access allowed only for registered users"));
    }

    if (!req.session.user.isAdmin()) {
        return next(new HttpError(401, "Access allowed only for registered users"));
    }

    next();
};