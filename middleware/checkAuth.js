var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    if (!req.session.user) {
        // TODO: how to show an error message and redirect?
        //return next(new HttpError(401, "Access allowed only for registered users"));
        res.redirect('/login');
    }

    next();
};