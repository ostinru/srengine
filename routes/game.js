var logger = require('lib/logger')(module);
var HttpError = require('error').HttpError;
var config = require('../config');

exports.get = function(req, res, next){
    res.json({
        startTime : (new Date(config.get('startTime'))).toJSON(),
        finishTime : (new Date(config.get('finishTime'))).toJSON()
    });
}

exports.post = function(req, res, next){
    logger.info("Times: ", req.body);
    
    // step 1: validate:
    if (req.body.startTime === undefined && req.body.finishTime === undefined) {
        return res.sendHttpError(new HttpError(400, 'No data'));
    }
    
    // step 2: set time:
    if (req.body.startTime !== undefined) {
        var startTime = new Date(req.body.startTime);
        if (startTime.toJSON() === null) {
            return res.sendHttpError(new HttpError(400, 'Invalid StartTime'));
        }
        logger.info('Set StartTime = ' + startTime);
        config.set("startTime", startTime.toJSON());
    }

    if (req.body.finishTime !== undefined) {
        var finishTime = new Date(req.body.finishTime);
        if (finishTime.toJSON() === null) {
            return res.sendHttpError(new HttpError(400, 'Invalid FinishTime'));
        }
        logger.info('Set FinishTime = ' + finishTime);
        config.set("finishTime", finishTime.toJSON());
    }

    // FIXME: save to db/config-file!
    // FIXME: add admin message

    return res.json({
        status: "Success",
        startTimeValue : config.get('startTime'),
        finishTimeValue : config.get('finishTime')}
    );
}
