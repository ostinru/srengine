var logger = require('lib/logger')(module);
var HttpError = require('error').HttpError;
var config = require('../config');

exports.get = function(req, res, next){
    res.json({
        startTimeValue : config.get('startTime'),
        finishTimeValue : config.get('finishTime')
    });
}

exports.post = function(req, res, next){
    logger.info("Times: ", req.body);
    
    // step 1: validate:
    if (req.body.startTime === undefined && req.body.finishTime === undefined) {
        return res.sendHttpError(new HttpError(400, 'No data'));
    }
    // FIXME: check Date format!!!

    // step 2: set time:
    if (req.body.startTime !== undefined) {
        config.set("startTime", req.body.startTime);
    }

    if (req.body.finishTime !== undefined) {
        config.set("finishTime", req.body.finishTime);
    }

    return res.json({
        status: "Success",
        startTimeValue : config.get('startTime'),
        finishTimeValue : config.get('finishTime')}
    );
}
