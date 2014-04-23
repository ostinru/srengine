var config = require('../config');
var logger = require('lib/logger')(module);
var startTime = Date.parse(config.get('startTime'));
var finishTime = Date.parse(config.get('finishTime'));

module.exports = function (req, res, next) {
    if (Date.now() < startTime) {
        res.locals.timeStart = Date.parse(config.get('startTime'));
        res.render('start');
        return;
    }
    else {
        if (Date.now() > finishTime) {
            res.render('finish');
            return;
        }
    }
    next();
}

