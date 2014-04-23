var config = require('../config');
var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    var period = parseInt(config.get("bruteforcetime"));
    var user = req.user;
    if (user.lastActivity && (Date.now() < user.lastActivity + period*1000)) {
        res.sendHttpError(new HttpError(429, "Too many requests. Wait " + period + " seconds"));
        return;
    }
    
    user.lastActivity = Date.now();
    user.save(function() {
        next();
    });
};
