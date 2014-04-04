var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;

exports.get = function(req, res, next){
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
        res.json(req.user.position);
    } else {
        res.render('map');
    }
}

exports.post = function(req, res, next){
	logger.info('POST on "' + req.path + '": ', req.body);
    req.user.position.X = req.body.position.X; //TODO validate X Y
    req.user.position.Y = req.body.position.Y;
    req.user.save();
	res.json({ error : null, position : req.user.position });
};
