var User = require('models/user').User;

module.exports = function(req, res, next) {
    if (!req.session.user) return next();

    User.findById(req.session.user).exec(function(err, user) {
        if (err) return next(err);
        req.user = user;
        next();
    });

};
