var config = require('../config');
var logger = require('lib/logger')(module);
var startTime = Date.parse(config.get('startTime'));
var finishTime = Date.parse(config.get('finishTime'));
var Problem = require('models/problem').Problem;

module.exports = function (req, res, next) {
    Problem.count({},function(err,count){
        if(count === req.user.problemHistory.length){
            logger.info("finish");
            res.render('finish');
        }
        else{
            logger.info(startTime);
            logger.info(Date.now());
            logger.info(finishTime);
            if (Date.now() < startTime) {
                res.locals.timeStart = Date.parse(config.get('startTime'));
                res.render('start');
            }
            else {
                if (Date.now() > finishTime) {
                    res.render('finish');
                }
                else  next();
            }
        }
    });
}